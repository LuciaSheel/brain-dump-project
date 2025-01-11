const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Create user (bcrypt will hash password in the model)
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
};

// Log in a user
const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error during login', error: err });
    }
    if (!user) {
      return res.status(400).json({ message: info.message }); // info.message contains specific error details
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in', error: err });
      }
      res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next); // Pass req, res, and next to passport's authentication
};

// Log out a user
const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

module.exports = { registerUser, loginUser, logoutUser };