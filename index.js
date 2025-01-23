const { isAuthenticated } = require('./config/authMiddleware');

const express = require('express');
// Initialize the app
const app = express();
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const Note = require('./models/noteModel');

// Handle favicon.ico request to avoid 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

//Set EJS as the view engine
app.set('view engine', 'ejs');

// Import config files
require('dotenv').config(); // Load environment variables from .env
const connectDB = require('./config/db'); // Import the database connection function
require('./config/passport'); // Initialize passport configuration

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Environment variable for security
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // This will enable `req.user`
// Import routes
const authRouter = require('./routers/authRouter');
const notesRouter = require('./routers/notesRouter');

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // To parse JSON payloads
app.use(express.urlencoded({ extended: true })); // For URL-encoded data (form data)

// Connect to the database
connectDB();

// Use routes
app.use('/', notesRouter);
app.use('/auth', authRouter); // Authentication routes (login, registration)
app.use('/notes', isAuthenticated, notesRouter); // Notes routes (CRUD operations)

// Authentication-related routes
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

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});