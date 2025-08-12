const express = require("express");
const router = express.Router();
const Balance = require("../models/Balances");
const User = require("../models/Users");

// Get balances for a user
router.get("/balances/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    let balances = await Balance.findOne({ userId })
      .populate("owes.toUser", "name email")
      .populate("owed.fromUser", "name email");

    if (!balances) {
      // If no record, return empty owes and owed
      balances = {
        userId,
        owes: [],
        owed: [],
      };
    }

    res.status(200).json({ success: true, balances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update balances after an expense or settlement
router.post("/balances/update", async (req, res) => {
  try {
    // Expected: summary = { userId: amount, ... }, paidBy = userId, amount, splitType, date
    const { summary, paidBy, amount, splitType } = req.body;
    if (!summary || !paidBy || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // For each user in summary, update owes/owed balances with paidBy
    // For simplicity, we just handle the core logic:
    for (const [userId, userAmount] of Object.entries(summary)) {
      if (userId === paidBy || userAmount === 0) continue;

      const amountNum = Number(userAmount);
      if (amountNum === 0) continue;

      // Update 'userId' owes 'paidBy'
      let userBalance = await Balance.findOne({ userId });
      if (!userBalance) {
        userBalance = new Balance({ userId, owes: [], owed: [] });
      }
      // Remove any existing owes/owed entries between userId and paidBy
      userBalance.owes = userBalance.owes.filter(o => !o.toUser.equals(paidBy));
      userBalance.owed = userBalance.owed.filter(o => !o.fromUser.equals(paidBy));
      // Add new owes
      userBalance.owes.push({ toUser: paidBy, amount: amountNum });
      await userBalance.save();

      // Update 'paidBy' is owed by 'userId'
      let paidByBalance = await Balance.findOne({ userId: paidBy });
      if (!paidByBalance) {
        paidByBalance = new Balance({ userId: paidBy, owes: [], owed: [] });
      }
      paidByBalance.owes = paidByBalance.owes.filter(o => !o.toUser.equals(userId));
      paidByBalance.owed = paidByBalance.owed.filter(o => !o.fromUser.equals(userId));
      paidByBalance.owed.push({ fromUser: userId, amount: amountNum });
      await paidByBalance.save();
    }

    res.status(200).json({ success: true, message: "Balances updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Settle up between two users
router.post("/balances/settle", async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    if (!from || !to || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Remove balances (or reduce amounts) between from and to

    const fromBalance = await Balance.findOne({ userId: from });
    const toBalance = await Balance.findOne({ userId: to });

    if (fromBalance) {
      fromBalance.owes = fromBalance.owes.filter(o => !o.toUser.equals(to));
      fromBalance.owed = fromBalance.owed.filter(o => !o.fromUser.equals(to));
      await fromBalance.save();
    }

    if (toBalance) {
      toBalance.owes = toBalance.owes.filter(o => !o.toUser.equals(from));
      toBalance.owed = toBalance.owed.filter(o => !o.fromUser.equals(from));
      await toBalance.save();
    }

    res.status(200).json({ success: true, message: "Settlement completed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
