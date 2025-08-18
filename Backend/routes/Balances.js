const express = require("express");
const router = express.Router();
const Balance = require("../models/Balances");
const User = require("../models/Users");

router.get("/balances/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    let balancesDoc = await Balance.findOne({ userId }).lean();

    if (!balancesDoc) {
      return res.status(200).json({
        success: true,
        balances: {},
      });
    }
    const balancesArray = await Promise.all(
      Object.entries(balancesDoc.balances || {}).map(
        async ([otherUserId, amount]) => {
          const user = await User.findById(otherUserId, "name email");
          return {
            userId: otherUserId,
            name: user?.name || "Unknown",
            email: user?.email || "Unknown",
            amount,
          };
        }
      )
    );

    res.status(200).json({ success: true, balances: balancesArray });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/balances/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    let balancesDoc = await Balance.findOne({ userId }).lean();

    if (!balancesDoc || !balancesDoc.balances) {
      return res.status(200).json({
        success: true,
        balance: 0, // default if no balance record exists
      });
    }

    const amount = balancesDoc.balances[friendId] || 0;

    // Optionally fetch friend details
    const friend = await User.findById(friendId, "name email");

    res.status(200).json({
      success: true,
      balance: {
        userId: friendId,
        name: friend?.name || "Unknown",
        email: friend?.email || "Unknown",
        amount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post("/balances/update", async (req, res) => {
  try {
    const { summary, paidBy, amount } = req.body;
    if (!summary || !paidBy || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const paidByUser = await User.findOne({ name: paidBy });
    if (!paidByUser) {
      return res
        .status(400)
        .json({ success: false, message: "PaidBy user not found" });
    }
    const paidById = paidByUser._id.toString();

    for (const [name, userAmount] of Object.entries(summary)) {
      const user = await User.findOne({ name });
      if (!user || String(user._id) === paidById || userAmount === 0) continue;

      const userId = user._id.toString();
      const amt = Number(userAmount);

      let debtorBalance = await Balance.findOne({ userId });
      if (!debtorBalance) debtorBalance = new Balance({ userId });
      debtorBalance.balances.set(
        paidById,
        (debtorBalance.balances.get(paidById) || 0) - amt
      );
      await debtorBalance.save();

      let creditorBalance = await Balance.findOne({ userId: paidById });
      if (!creditorBalance) creditorBalance = new Balance({ userId: paidById });
      creditorBalance.balances.set(
        userId,
        (creditorBalance.balances.get(userId) || 0) + amt
      );
      await creditorBalance.save();
    }

    res.status(200).json({ success: true, message: "Balances updated ✅" });
  } catch (err) {
    console.error("Balance update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/balances/settle", async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    if (!from || !to || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const fromBalance = await Balance.findOne({ userId: from });
    const toBalance = await Balance.findOne({ userId: to });

    if (fromBalance) {
      fromBalance.owes = fromBalance.owes
        .map((o) => {
          if (o.toUser.equals(to)) {
            o.amount -= amount;
            if (o.amount <= 0) return null;
          }
          return o;
        })
        .filter(Boolean);

      fromBalance.owed = fromBalance.owed
        .map((o) => {
          if (o.fromUser.equals(to)) {
            o.amount -= amount;
            if (o.amount <= 0) return null;
          }
          return o;
        })
        .filter(Boolean);

      await fromBalance.save();
    }

    if (toBalance) {
      toBalance.owes = toBalance.owes
        .map((o) => {
          if (o.toUser.equals(from)) {
            o.amount -= amount;
            if (o.amount <= 0) return null;
          }
          return o;
        })
        .filter(Boolean);

      toBalance.owed = toBalance.owed
        .map((o) => {
          if (o.fromUser.equals(from)) {
            o.amount -= amount;
            if (o.amount <= 0) return null;
          }
          return o;
        })
        .filter(Boolean);

      await toBalance.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Partial settlement completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
