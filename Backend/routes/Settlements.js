const express = require("express");
const router = express.Router();
const Settlement = require("../models/Settlement");
const Balance = require("../models/Balances");
const GroupBalance = require("../models/GroupBalance");
const Group = require("../models/Groups");

router.post("/settlement", async (req, res) => {
  try {
    let { from, to, amount, paymentMode, type, group, date, settleInGroup } =
      req.body;

    if (!from || !to || !amount || !paymentMode || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Parse date
    if (date) {
      const parts = date.split("-");
      if (parts[0].length === 4) {
        const [year, month, day] = parts;
        date = new Date(`${year}-${month}-${day}`);
      } else {
        const [day, month, year] = parts;
        date = new Date(`${year}-${month}-${day}`);
      }
    } else {
      date = new Date();
    }

    // Save settlement record
    const newSettlement = new Settlement({
      from,
      to,
      amount,
      paymentMode,
      type,
      group: type === "group" ? group : null,
      date,
      settleInGroup,
    });
    await newSettlement.save();

    let remainingAmount = amount;
    console.log("Remaining amount ", remainingAmount);

    if (type === "group" && group) {
      await updateGroupBalances(group, from, to, remainingAmount);
    } else {
      if (settleInGroup) {
        const sharedGroups = await Group.find({
          members: { $all: [from, to] },
        }).select("_id");

        console.log("Shared Groups: ", sharedGroups);

        const groupsWithDebt = [];
        for (let g of sharedGroups) {
          const fromGB = await GroupBalance.findOne({
            groupId: g._id,
            userId: from,
          });
          if (fromGB && (fromGB.balances.get(to.toString()) || 0) < 0) {
            groupsWithDebt.push(g);
          }
        }

        // If more than 1 group has debt, warn user
        if (groupsWithDebt.length > 1) {
          return res.status(400).json({
            success: false,
            message: `Multiple groups have outstanding debt. Please specify which group to settle!`,
          });
        }

        for (let g of sharedGroups) {
          if (remainingAmount <= 0) break;

          const fromGB =
            (await GroupBalance.findOne({ groupId: g._id, userId: from })) ||
            new GroupBalance({ groupId: g._id, userId: from, balances: {} });
          const toGB =
            (await GroupBalance.findOne({ groupId: g._id, userId: to })) ||
            new GroupBalance({ groupId: g._id, userId: to, balances: {} });

          const fromBalances = fromGB.balances || {};
          const toBalances = toGB.balances || {};

          console.log("From Balance ", fromBalances.get(to.toString()));
          console.log("To Balnce ", toBalances);
          let debt = fromBalances.get(to.toString()) || 0;
          console.log("debt ", debt);

          let debtAmount = debt < 0 ? -debt : 0;

          if (debtAmount <= 0) {
            console.log("No debt");
            continue;
          }
          console.log("debt");
          const payment = Math.min(remainingAmount, debtAmount);

          // Update balances
          fromBalances.set(to.toString(), debt + payment); // increase towards zero
          toBalances.set(
            from.toString(),
            (toBalances.get(from.toString()) || 0) - payment
          );

          if (Math.abs(fromBalances.get(to.toString())) < 0.01)
            fromBalances.delete(to.toString());
          if (Math.abs(toBalances.get(from.toString())) < 0.01)
            toBalances.delete(from.toString());

          // Assign back and recalc netBalance
          fromGB.balances = fromBalances;
          toGB.balances = toBalances;

          fromGB.netBalance = Array.from(fromBalances.values()).reduce(
            (sum, val) => sum + val,
            0
          );
          toGB.netBalance = Array.from(toBalances.values()).reduce(
            (sum, val) => sum + val,
            0
          );

          await fromGB.save();
          await toGB.save();

          // remainingAmount -= payment;
        }
      }
      // Get global balances
      const fromBalanceI =
        (await Balance.findOne({ userId: from })) ||
        new Balance({ userId: from });

      // Actual debt for individual expenses only
      // We need to exclude group-related debts
      let individualDebt = 0;

      for (let [key, val] of fromBalanceI.balances) {
        if (key === to.toString()) {
          // Here, val might include total debt (individual + group)
          // If you separately store group balances in GroupBalance, we can subtract them
          // Example: sum of debts from all groups
          const sharedGroups = await Group.find({
            members: { $all: [from, to] },
          }).select("_id");

          let groupDebt = 0;
          for (let g of sharedGroups) {
            const gb = await GroupBalance.findOne({
              groupId: g._id,
              userId: from,
            });
            if (gb) {
              groupDebt += gb.balances.get(to.toString()) || 0;
            }
          }

          individualDebt = -(val - groupDebt); // val is negative if from owes to to
          break;
        }
      }

      individualDebt = Math.max(individualDebt, 0); // just to be safe
      if (remainingAmount > individualDebt) {
        return res.status(400).json({
          success: false,
          message: `You only need to settle Rs ${individualDebt} for individual expenses.`,
        });
      }

      // Apply any remaining amount to global balances
      // if (remainingAmount > 0) {
      const fromBalance =
        (await Balance.findOne({ userId: from })) ||
        new Balance({ userId: from });
      const toBalance =
        (await Balance.findOne({ userId: to })) || new Balance({ userId: to });

      const currentDebt = fromBalance.balances.get(to.toString()) || 0;

      fromBalance.balances.set(to.toString(), currentDebt + remainingAmount);
      toBalance.balances.set(
        from.toString(),
        (toBalance.balances.get(from.toString()) || 0) - remainingAmount
      );

      // Cleanup near-zero balances
      for (let [key, val] of fromBalance.balances)
        if (Math.abs(val) < 0.01) fromBalance.balances.delete(key);
      for (let [key, val] of toBalance.balances)
        if (Math.abs(val) < 0.01) toBalance.balances.delete(key);

      await fromBalance.save();
      await toBalance.save();
      //  }
    }

    res.status(201).json({ success: true, settlement: newSettlement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

async function updateGroupBalances(groupId, from, to, amount) {
  const fromGB =
    (await GroupBalance.findOne({ groupId, userId: from })) ||
    new GroupBalance({ groupId, userId: from });
  const toGB =
    (await GroupBalance.findOne({ groupId, userId: to })) ||
    new GroupBalance({ groupId, userId: to });
  const currentDebtt = fromGB.balances.get(to.toString()) || 0;
  const groupDebtAmount = currentDebtt < 0 ? -currentDebtt : 0;

  if (amount > groupDebtAmount) {
    throw new Error(
      `Settlement amount Rs (${amount}) exceeds outstanding debt Rs (${groupDebtAmount}) in this group.`
    );
  }

  fromGB.balances.set(
    to.toString(),
    (fromGB.balances.get(to.toString()) || 0) + amount
  );
  toGB.balances.set(
    from.toString(),
    (toGB.balances.get(from.toString()) || 0) - amount
  );

  for (let [k, v] of fromGB.balances)
    if (Math.abs(v) < 0.01) fromGB.balances.delete(k);
  for (let [k, v] of toGB.balances)
    if (Math.abs(v) < 0.01) toGB.balances.delete(k);

  fromGB.netBalance = Array.from(fromGB.balances.values()).reduce(
    (sum, val) => sum + val,
    0
  );
  toGB.netBalance = Array.from(toGB.balances.values()).reduce(
    (sum, val) => sum + val,
    0
  );

  const fromBalance =
    (await Balance.findOne({ userId: from })) || new Balance({ userId: from });
  const toBalance =
    (await Balance.findOne({ userId: to })) || new Balance({ userId: to });

  const currentDebt = fromBalance.balances.get(to.toString()) || 0;

  fromBalance.balances.set(to.toString(), currentDebt + amount);
  toBalance.balances.set(
    from.toString(),
    (toBalance.balances.get(from.toString()) || 0) - amount
  );

  for (let [key, val] of fromBalance.balances)
    if (Math.abs(val) < 0.01) fromBalance.balances.delete(key);
  for (let [key, val] of toBalance.balances)
    if (Math.abs(val) < 0.01) toBalance.balances.delete(key);

  await fromBalance.save();
  await toBalance.save();

  await fromGB.save();
  await toGB.save();
}

router.get("/settlement", async (req, res) => {
  try {
    const settlements = await Settlement.find()
      .populate("from", "name email")
      .populate("to", "name email")
      .populate("group", "name");
    res.status(200).json({ success: true, settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/settlement/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const settlements = await Settlement.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from", "name email")
      .populate("to", "name email")
      .populate("group", "name");

    res.status(200).json({ success: true, settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/settlement/group/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).select("members");
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }
    const settlements = await Settlement.find({
      $or: [
        { group: groupId, type: "group" },
        {
          type: "individual",
          from: { $in: group.members },
          to: { $in: group.members },
        },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("from", "name email")
      .populate("to", "name email")
      .populate("group", "name");

    res.status(200).json({ success: true, settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/settlement/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const settlements = await Settlement.find({
      $or: [
        { from: userId, to: friendId },
        { from: friendId, to: userId },
      ],
    })
      .populate("from", "name email")
      .populate("to", "name email")
      .populate("group", "name")
      .select("amount date paymentMode type")
      .sort({ date: -1 });

    res.status(200).json({ success: true, settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
