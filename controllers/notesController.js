const Note = require('../models/noteModel');  // Import the Note model

// GET all notes for the authenticated user
const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
};

// POST a new note for the authenticated user
const createNote = async (req, res) => {
    const { title, content, date } = req.body;
    try {
        const newNote = new Note({
            title,
            content,
            date,
            user: req.user._id
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving note', error: err });
    }
};
