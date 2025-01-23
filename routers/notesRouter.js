const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/authMiddleware');  // Import the authentication middleware
const {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/notesController'); // Import controller functions

router.get('/test', (req, res) => {
    res.send('Test route hit');
});

// Check if the router is hit
router.get('/notes', (req, res, next) => {
    console.log('GET /notes router hit');
    next();  // Proceed to the next middleware or route handler
});

router.get('/notes', isAuthenticated, getAllNotes);  // Re-enable authentication middleware

// POST a new note for the authenticated user
router.post('/', isAuthenticated, createNote);

// PUT (update) an existing note
router.put('/:noteId', isAuthenticated, updateNote);

// DELETE a note
router.delete('/:noteId', isAuthenticated, deleteNote);

module.exports = router;
