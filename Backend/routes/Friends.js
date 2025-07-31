const express = require('express');
const router = express.Router();
const Friend = require('../models/Friends');
const User = require('../models/Users');

router.get('/friends/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const friends = await Friend.find({ user: user._id }).populate('friend', 'name email');

    res.status(200).json({ success: true, friends });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post('/friends', async (req, res) => {
  const { userId, friendName, friendEmail } = req.body;

  if (!userId || !friendName || !friendEmail) {
    return res.status(400).json({ success: false, message: 'userId, friendName, and friendEmail are required' });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    let friendUser = await User.findOne({ name: friendName, email: friendEmail });
    if (!friendUser) {
      friendUser = await User.create({ name: friendName, email: friendEmail });
    }

    const existing = await Friend.findOne({ user: user._id, friend: friendUser._id });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Friend already added' });
    }

    const [friendship1, friendship2] = await Promise.all([
      Friend.create({ user: user._id, friend: friendUser._id }),
      Friend.create({ user: friendUser._id, friend: user._id }),
    ]);

   
    const populated = await Friend.findById(friendship1._id)
      .populate('user', 'name email')
      .populate('friend', 'name email');

    res.status(201).json({ success: true, message: 'Friendship added in both directions', friend: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.put('/friends/:friendId', async (req, res) => {
  const { friendId } = req.params;
  const { friendName, friendEmail } = req.body;

  try {
    
    const friendship = await Friend.findById(friendId);
    if (!friendship) {
      return res.status(404).json({ success: false, message: 'Friendship not found' });
    }

    const friendUser = await User.findById(friendship.friend);
    if (!friendUser) {
      return res.status(404).json({ success: false, message: 'Friend user not found' });
    }

    if (friendName) friendUser.name = friendName;
    if (friendEmail) friendUser.email = friendEmail;

    await friendUser.save();

    const updated = await Friend.findById(friendId)
      .populate('user', 'name email')
      .populate('friend', 'name email');

    res.status(200).json({ success: true, message: 'Friend updated', friend: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.delete('/friends/:friendId', async (req, res) => {
  const { friendId } = req.params;

  try {
    const deleted = await Friend.findByIdAndDelete(friendId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Friend not found' });
    }

    res.status(200).json({ success: true, message: 'Friendship deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
