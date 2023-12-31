const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const router = express.Router();
//signup
router.post('/signup', async (req, res) => {
  try {
    //check if user exists or not
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      const response = {
        message: 'Email already exists',
        success: false,
      };
      return res.status(400).json(response);
    }
   //check if email is invalid
    if (!req.body.email.endsWith('@gmail.com')) {
      const response = {
        message: 'Enter Valid Email-Id with @gmail.com',
        success: false,
      };
      return res.status(400).json(response);
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();

    const response = {
      message: 'Registration Successful',
      success: true,
    };
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while signing up' });
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    //check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const response = {
        message: 'SignUp First',
        success: false,
      };
      return res.status(402).json(response);
     
    }
    //matching password
    if (user.password !== req.body.password) {
      const response = {
        message: 'Wrong PassWord',
        success: false,
      };
      return res.status(402).json(response);
    }
    //generate jwt
  const token = jwt.sign({ userId: user._id, email: user.email }, 'taskmanagingistheassignment', {
      expiresIn: '7d',
    });
    const response = {
      message: 'Login Success',
      success: true,
      token: token
    };
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while logging in' });
  }
});
module.exports = router;
