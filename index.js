// index.js
const { isAuthenticated } = require('./config/authMiddleware');

const express = require('express');
// Initialize the app
const app = express();
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const Note = require('./models/noteModel'); // Adjust path as needed

// Set EJS as the view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));


// Import config files
require('dotenv').config();  // Load environment variables from .env
const connectDB = require('./config/db');  // Import the database connection function
require('./config/passport');  // Initialize passport configuration

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',  // Use environment variable for security
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }    // Use `true` if using HTTPS
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());  // This will enable `req.user`
// Import routes
const authRouter = require('./routers/authRouter');
const notesRouter = require('./routers/notesRouter');


// Middleware to log every incoming request
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();  // Proceed to the next middleware or route handler
});

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());  // To parse JSON payloads
app.use(express.urlencoded({ extended: true }));  // For URL-encoded data (form data)



// Connect to the database
connectDB();  // Call the function to connect to MongoDB

app.get('/notes', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
  });

app.get('/notes', isAuthenticated, async (req, res) => {
    try {
      // Fetch all notes
      const notes = await Note.find({});
      res.json(notes); // Send all notes as JSON
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

// app.get('/notes', isAuthenticated, async (req, res) => {
//     try {
//       console.log('Authenticated user:', req.user);  // Log the authenticated user
//       const notes = await Note.find({ user: req.user._id });
//       console.log('Fetched notes:', notes);  // Log the fetched notes
  
//       if (notes.length === 0) {
//         return res.status(404).json({ error: 'No notes found' });
//       }
  
//       res.render('notes', { notes: notes });
//     } catch (err) {
//       console.error('Error fetching notes:', err);
//       res.status(500).json({ error: 'Failed to fetch notes' });
//     }
//   });
  
  
  
  

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

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
