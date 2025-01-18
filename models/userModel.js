// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]  // Add a reference to the Note model
});

// Presave hook to hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it is modified (or new)
  if (!this.isModified('password')) return next();
  try {
    // Hash the password with bcrypt using a salt rounds value of 10
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Move to the next middleware or save the document
  } catch (err) {
    next(err); // Pass error to the next middleware
  }
});

// Method to compare a plain-text password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Compare the candidate password with the stored hashed password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) { // Pass error to the calling function
    throw err;
  }
};

// Export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;