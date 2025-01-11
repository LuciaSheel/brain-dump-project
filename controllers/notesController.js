const Note = require('../models/noteModel');  // Import the Note model

// GET all notes for authenticated user
const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
};