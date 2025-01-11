const express = require('express');
const passport = require('../config/passport');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController'); // Import controller functions
const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

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
