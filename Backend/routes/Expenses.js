const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const User = require("../models/Users");

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
      tipPercent
    } = req.body;

    const memberEmails = members.map(m => m.email);
    const foundUsers = await User.find({ email: { $in: memberEmails } });
    if (foundUsers.length !== members.length) {
      return res.status(400).json({ success: false, message: "One or more members not found" });
    }

    const expense = new Expense({
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
      tipPercent
    });

    await expense.save();

    const populatedExpense = await expense.populate([
      { path: "paidBy", select: "name email" },
      { path: "group", select: "name" }
    ]);

    res.status(201).json({ success: true, expense: populatedExpense });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



router.get("/expense", async (req, res) => {
  const { groupId, userId } = req.query;

  let filter = {};
  if (groupId) filter.group = groupId;
  if (userId) filter.paidBy = userId;

  try {
    const expenses = await Expense.find(filter)
      .populate("paidBy", "name email")
      .populate("group", "name");
    res.status(200).json({ success: true, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/expense/:expenseId", async (req, res) => {
  try {
    const expense = await Expense.findOne({ expenseId: req.params.expenseId })
      .populate("paidBy", "name email")
      .populate("group", "name");

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
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
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, message: "Expense updated", expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


router.delete("/expense/:expenseId", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ expenseId: req.params.expenseId });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
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
        { "members.email": (await getUserEmail(userId)), paidBy: { $ne: userId }, "members.email": friendEmail },
      ]
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
