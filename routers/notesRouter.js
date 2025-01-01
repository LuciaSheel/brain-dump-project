const { isAuthenticated } = require('../config/authMiddleware.js');
const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel'); // Adjust if needed
console.log('Current directory:', __dirname);

// CREATE: Add a new note
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
      user: req.user._id, // Assuming you're storing the user ID for the note
    });
    await newNote.save();
    res.status(201).json({ message: 'Note created', note: newNote });
  } catch (err) {
    res.status(400).json({ message: 'Error creating note', error: err });
  }
});

// READ: Get all notes for the authenticated user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching notes', error: err });
  }
});

// READ: Get a specific note by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching note', error: err });
  }
});

// UPDATE: Update a specific note
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true } // Return the updated document
    );
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note updated', note: updatedNote });
  } catch (err) {
    res.status(400).json({ message: 'Error updating note', error: err });
  }
});

// DELETE: Delete a specific note
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting note', error: err });
  }
});

module.exports = router;
