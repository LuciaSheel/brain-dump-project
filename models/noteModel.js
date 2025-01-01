const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Note Schema
const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
