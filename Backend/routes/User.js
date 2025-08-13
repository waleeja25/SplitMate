const express = require('express');
const router = express.Router();
const User = require('../models/Users'); 
const {generateToken} = require('../jwt')

router.get('/user', async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post('/register', async (req, res) => {
  console.log("Request Received");

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = generateToken({ email: newUser.email, id: newUser._id });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
      }, 
       token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const {name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({ email: user.email, id: user._id });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
      }, 
      token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


module.exports = router;
