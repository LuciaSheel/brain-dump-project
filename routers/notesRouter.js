// routers/notesRouter.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/authMiddleware');  // Import the authentication middleware
const {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/notesController'); // Import controller functions

// GET all notes for the authenticated user
router.get('/', isAuthenticated, getAllNotes);

// POST a new note for the authenticated user
router.post('/', isAuthenticated, createNote);

// PUT (update) an existing note
router.put('/:noteId', isAuthenticated, updateNote);

// DELETE a note
router.delete('/:noteId', isAuthenticated, deleteNote);

module.exports = router;
