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
router.put('/:noteId', isAuthenticated, async (req, res) => {
    const { noteId } = req.params;
    const { title, content, date } = req.body;
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content, date },
            { new: true }  // Return the updated note
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(updatedNote);  // Return the updated note
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating note', error: err });
    }
});

// DELETE a note
router.delete('/:noteId', isAuthenticated, async (req, res) => {
    const { noteId } = req.params;
    try {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting note', error: err });
    }
});

module.exports = router;
