const express = require("express");
const router = express.Router();
const Settlement = require("../models/Settlement");

router.post("/settlement", async (req, res) => {
  try {
    const { from, to, amount, paymentMode, type, group, description } = req.body;

    if (!from || !to || !amount || !paymentMode || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (from, to, amount, paymentMode, type)",
      });
    }

    if (type === "group" && !group) {
      return res.status(400).json({
        success: false,
        message: "Group ID is required for group settlements",
      });
    }

    const newSettlement = new Settlement({
      from,
      to,
      amount,
      paymentMode,
      type,
      group: type === "group" ? group : null,
      description: description || "",
    });

    await newSettlement.save();

    res.status(201).json({
      success: true,
      settlement: newSettlement,
    });
  } catch (err) {
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

module.exports = router;
