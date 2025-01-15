// models/noteModel.js
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
  date: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  }
}, { timestamps: true });  // Mongoose adds createdAt and updatedAt

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
