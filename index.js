// index.js
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

// Import config files
require('dotenv').config();  // Load environment variables from .env
const connectDB = require('./config/db');  // Import the database connection function
require('./config/passport')(passport);  // Initialize passport configuration

// Import routes
const authRouter = require('./routers/authRouter');
const notesRouter = require('./routers/notesRouter');

// Initialize the app
const app = express();

// Middleware setup
app.use(express.json());  // to parse JSON payloads
app.use(express.urlencoded({ extended: true }));  // for URL-encoded data (form data)

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',  // Use environment variable for security
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());  // This will enable `req.user`

// Connect to the database
connectDB();  // Call the function to connect to MongoDB

// Use routes
app.use('/auth', authRouter);  // Authentication routes (login, registration)
app.use('/notes', notesRouter);  // Notes routes (CRUD operations)

// Protected route for displaying notes
app.get('/notes', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Here are your notes', notes: req.user.notes });
  } else {
    res.status(401).json({ message: 'You are not authenticated' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Note-Taking App!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
