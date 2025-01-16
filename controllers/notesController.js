// controllers/notesController.js
const Note = require('../models/noteModel');  // Import the Note model

// GET all notes for the authenticated user
const getAllNotes = async (req, res) => {
    console.log('Route /notes was hit');
    console.log('Route /notes was hit by user:', req.user);

    try {
        // Fetch notes from the database
        const notes = await Note.find({ user: req.user._id }); // Assuming notes are tied to a user
        
        // Respond with the notes
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        
        // Respond with an error message
        res.status(500).json({ message: 'Failed to fetch notes', error });
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

// PUT (update) an existing note
const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { title, content, date } = req.body;
  try {
      const updatedNote = await Note.findByIdAndUpdate(
          noteId,
          { title, content, date },
          { new: true }
      );
      if (!updatedNote) {
          return res.status(404).json({ message: 'Note not found' });
      }
      res.json(updatedNote);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating note', error: err });
  }
};

// DELETE a note
const deleteNote = async (req, res) => {
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
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };