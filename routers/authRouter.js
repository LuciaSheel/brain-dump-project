const express = require('express');
const passport = require('../config/passport');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route with custom error handling
router.post('/login', (req, res, next) => {
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
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
