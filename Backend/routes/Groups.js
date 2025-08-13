const express = require("express");
const router = express.Router();
const Groups = require("../models/Groups");
const User = require("../models/Users");
const {jwtAuthMiddleware} = require("../jwt")

router.get("/groups/my", jwtAuthMiddleware, async (req, res) => {
  try {
    const currentUserEmail = req.user.email;
    const user = await User.findOne({ email: currentUserEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const groups = await Groups.find({ members: user._id }).populate("members", "name email");

    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/groups", async (req, res) => {
  console.log("Request received");

  try {
    const { name, members } = req.body;

    if (!name || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
      });
    }
    const existingGroup = await Groups.findOne({ name });
    if (existingGroup) {
      return res.status(409).json({
        success: false,
        message: "Group name already in use",
      });
    }

    const memberIds = [];

    for (const member of members) {
      const { name, email } = member;

      if (!email || !name) continue;

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({ name, email });
      }

      memberIds.push(user._id);
    }

    const newGroup = new Groups({ name, members: memberIds });
    await newGroup.save();

    const populatedGroup = await Groups.findById(newGroup._id).populate(
      "members",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: {
        groupId: populatedGroup.groupId,
        name: populatedGroup.name,
        members: populatedGroup.members,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


router.put("/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const { name, members } = req.body;

  try {
    const group = await Groups.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    if (name) group.name = name;

    if (Array.isArray(members)) {
      const memberIds = [];

      for (const member of members) {
        const { name, email } = member;
        if (!email || !name) continue;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({ name, email });
        } else if (user.name !== name) {
          user.name = name;
          await user.save();
        }

        memberIds.push(user._id);
      }

      group.members = memberIds;
    }

    await group.save();

    const updatedGroup = await Groups.findById(group._id).populate(
      "members",
      "name email"
    );

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group: {
        groupId: updatedGroup.groupId,
        name: updatedGroup.name,
        members: updatedGroup.members,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const deleted = await Groups.findByIdAndDelete(groupId);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
