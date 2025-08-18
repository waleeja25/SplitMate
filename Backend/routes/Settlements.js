const express = require("express");
const router = express.Router();
const Settlement = require("../models/Settlement");
const Balance = require("../models/Balances");

router.post("/settlement", async (req, res) => {
  try {
    let { from, to, amount, paymentMode, type, group, date } = req.body;

    if (!from || !to || !amount || !paymentMode || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (date) {
      let parts = date.split("-");
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

    const newSettlement = new Settlement({
      from,
      to,
      amount,
      paymentMode,
      type,
      group: type === "group" ? group : null,
      date,
    });
    await newSettlement.save();

    let fromBalance = await Balance.findOne({ userId: from });
    if (!fromBalance) fromBalance = new Balance({ userId: from, balances: [] });

    let toBalance = await Balance.findOne({ userId: to });
    if (!toBalance) toBalance = new Balance({ userId: to, balances: [] });

    let fAmount = fromBalance.balances.get(to.toString()) || 0;
    fAmount += amount;
    fromBalance.balances.set(to.toString(), fAmount);

    let tAmount = toBalance.balances.get(from.toString()) || 0;
    tAmount -= amount;
    toBalance.balances.set(from.toString(), tAmount);

    for (let [key, val] of fromBalance.balances) {
      if (Math.abs(val) < 0.01) fromBalance.balances.delete(key);
    }
    for (let [key, val] of toBalance.balances) {
      if (Math.abs(val) < 0.01) toBalance.balances.delete(key);
    }

    await fromBalance.save();
    await toBalance.save();

    res.status(201).json({ success: true, settlement: newSettlement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

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

    const settlements = await Settlement.find({
      group: groupId,
      type: "group",
    })
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
