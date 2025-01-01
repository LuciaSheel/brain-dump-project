// routers/notesRouter.js
const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel');  // Import the Note model
const { isAuthenticated } = require('../config/authMiddleware');  // Import the authentication middleware

// GET all notes for the authenticated user
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // Fetch notes associated with the logged-in user
        const notes = await Note.find({ user: req.user._id });
        res.json(notes); // Send the notes as a response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
});

// POST a new note for the authenticated user
router.post('/', isAuthenticated, async (req, res) => {
    const { title, content, date } = req.body;
    try {
        const newNote = new Note({
            title,
            content,
            date,
            user: req.user._id  // Save the note with the logged-in user's ID
        });
        await newNote.save();  // Save the new note to the database
        res.status(201).json(newNote);  // Return the newly created note
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving note', error: err });
    }
});

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
