const express = require("express");
const router = express.Router();
const Settlement = require("../models/Settlement");

router.post("/settlement", async (req, res) => {
  try {
    const { from, to, amount, paymentMode } = req.body;

    if (!from || !to || !amount || !paymentMode) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newSettlement = new Settlement({ from, to, amount, paymentMode });
    await newSettlement.save();

    res.status(201).json({ success: true, settlement: newSettlement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/settlement", async (req, res) => {
  try {
    const settlements = await Settlement.find()
      .populate("from", "name email")
      .populate("to", "name email");
    res.status(200).json({ success: true, settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/settlement/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const settlements = await Settlement.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from", "name email")
      .populate("to", "name email");

    res.status(200).json({ success: true, settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
