const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");


router.post("/expense", async (req, res) => {
  try {
if (req.body.splitType === 'percentage') {
  const total = req.body.amount;
  const converted = {};
  for (let [email, percentage] of Object.entries(req.body.summary)) {
    converted[email] = (percentage / 100) * total;
  }
  req.body.summary = converted;
}

    const expense = new Expense(req.body);
    await expense.save();
    
    res.status(201).json({ success: true, expense });
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

const User = require("../models/Users");
async function getUserEmail(userId) {
  const user = await User.findById(userId).select("email");
  return user?.email || "";
}


module.exports = router;
