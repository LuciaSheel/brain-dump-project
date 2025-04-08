# Brain Dump Notes App

A simple web application for creating, editing, and deleting notes.

***

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (for local development, or provide a cloud database like MongoDB Atlas)

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/LuciaSheel/brainDump.git

2. Navigate to the directory:
    ```
    cd brainDump

3. Copy `.env.example` to `.env`:
    ```
    cp .env.example .env

4. Open `.env` and fill in your own values for:

- `MONGO_URI`

- `PORT`

- `SESSION_SECRET`

5. Install dependencies:
    ```
    npm install

4. Run the application:
    ```
    npm start

5. Open your browser and visit:
    ```
    http://localhost:3001/login

## Usage

1. Register
2. Log in
3. Create, edit, mark as done, and delete notes
4. Logout

## Database
The project uses MongoDB and the database is named `brainDump`.
