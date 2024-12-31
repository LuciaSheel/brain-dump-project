const express = require('express');
const passport = require('../config/passport');
const User = require('../models/userModel');
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/notes', // Redirect to notes page after successful login
  failureRedirect: '/login', // Redirect back to login page if login fails
}));

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { 
      return res.status(500).json({ message: 'Error logging out', error: err }); 
    }
    res.redirect('/login');
  });
});

module.exports = router;