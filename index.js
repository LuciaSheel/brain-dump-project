const express = require('express');
require('dotenv').config(); // Load environment variables from .env file
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// app.use(express.json());

// const authRouter = require('./routers/authRouter');
// const notesRouter = require('./routers/notesRouter');
// app.use('/auth', authRouter);
// app.use('/notes', notesRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
