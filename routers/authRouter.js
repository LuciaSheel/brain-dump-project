const express = require('express');
const passport = require('../config/passport');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController'); // Import controller functions
const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', (req, res, next) => loginUser(req, res, next, passport));

// Logout route
router.get('/logout', logoutUser);

module.exports = router;
