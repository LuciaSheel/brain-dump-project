// index.js
const { isAuthenticated } = require('./config/authMiddleware');

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

// Import config files
require('dotenv').config();  // Load environment variables from .env
const connectDB = require('./config/db');  // Import the database connection function
require('./config/passport');  // Initialize passport configuration

// Import routes
const authRouter = require('./routers/authRouter');
const notesRouter = require('./routers/notesRouter');

// Initialize the app
const app = express();

// Middleware setup
app.use(express.static('public'));  // Serve static files (css, js)
app.use(express.json());  // To parse JSON payloads
app.use(express.urlencoded({ extended: true }));  // For URL-encoded data (form data)

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

app.get('/notes', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
  });

// Use routes
app.use('/auth', authRouter);  // Authentication routes (login, registration)
app.use('/notes', notesRouter);  // Notes routes (CRUD operations)

// Authentication-related routes (simplified)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Note-Taking App!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
