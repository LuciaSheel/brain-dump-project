const express = require('express');
const passport = require('../config/passport');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController'); // Import controller functions
const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', (req, res, next) => {
  console.log('Login request body:', req.body);  // Log the login data being sent
  loginUser(req, res, next, passport);
});


// Logout route
// router.get('/logout', logoutUser);

router.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error('Error during logout:', err);
          return res.redirect('/notes'); // Redirect to notes if an error occurs
      }
      res.redirect('/login'); // Redirect to the login route
  });
});


module.exports = router;
