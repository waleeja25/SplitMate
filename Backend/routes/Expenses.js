const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const User = require("../models/Users");
const Group = require("../models/Groups");

router.get("/expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const expenses = await Expense.find({
      "members.userId": objectUserId,
    })
      .sort({ createdAt: -1 })
      .populate("paidBy", "name email")
      .populate("group", "name")
      .populate("members.userId", "name email");

    if (expenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expenses found",
      });
    }

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/expense", async (req, res) => {
  try {
    const {
      amount,
      category,
      splitType,
      paidBy,
      group,
      date,
      members,
      summary,
      exactAmounts,
      percentages,
      items,
      taxPercent,
      tipPercent,
    } = req.body;

    if (!members || members.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Members are required" });
    }

    const updatedMembers = [];
    for (const member of members) {
      let user = await User.findOne({ email: member.email });
      if (!user) {
        user = new User({ name: member.name, email: member.email });
        await user.save();
      }
      updatedMembers.push({
        userId: user._id,
        name: user.name,
        email: user.email,
      });
    }
    const paidByUser = await User.findOne({ name: paidBy });
    if (!paidByUser) {
      return res
        .status(400)
        .json({ success: false, message: "PaidBy user not found" });
    }
    let groupRef = null;
    if (group) {
      const foundGroup = await Group.findOne({ name: group });
      if (!foundGroup) {
        return res
          .status(400)
          .json({ success: false, message: "Group not found" });
      }
      groupRef = foundGroup._id;
    }
    const expense = new Expense({
      amount,
      category,
      splitType,
      paidBy: paidByUser._id,
      group: groupRef,
      date,
      members: updatedMembers,
      summary,
      exactAmounts,
      percentages,
      items,
      taxPercent,
      tipPercent,
    });

    await expense.save();

    const populatedExpense = await expense.populate([
      { path: "paidBy", select: "name email" },
      { path: "group", select: "name" },
    ]);

    res.status(201).json({ success: true, expense: populatedExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/expense/:expenseId", async (req, res) => {
  try {
    const expense = await Expense.findOne({ expenseId: req.params.expenseId })
      .populate("paidBy", "name email")
      .populate("group", "name");

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/expense/:expenseId", async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { expenseId: req.params.expenseId },
      req.body,
      { new: true }
    );
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Expense updated", expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/expense/:expenseId", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      expenseId: req.params.expenseId,
    });
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/expense/group/:groupId", async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate("paidBy", "name email")
      .populate("group", "name");

    res.status(200).json({ success: true, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/expense/friend/:userId/:friendEmail", async (req, res) => {
  const { userId, friendEmail } = req.params;

  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: userId, "members.email": friendEmail },
        {
          "members.email": await getUserEmail(userId),
          paidBy: { $ne: userId },
          "members.email": friendEmail,
        },
      ],
    })
      .populate("paidBy", "name email")
      .populate("group", "name");

    res.status(200).json({ success: true, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
async function getUserEmail(userId) {
  const user = await User.findById(userId).select("email");
  return user?.email || "";
}

module.exports = router;
