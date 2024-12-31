const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

// Configure Passport to use the LocalStrategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          console.error('User not found');
          return done(null, false, { message: 'Invalid credentials.' });
        }

        user.comparePassword(password)
          .then((isMatch) => {
            if (!isMatch) {
              console.error('Incorrect password');
              return done(null, false, { message: 'Invalid credentials.' });
            }
            return done(null, user); // User is authenticated
          })
          .catch((err) => {
            // Log the error and throw a descriptive error for easier debugging
            console.error('Error comparing passwords:', err);
            throw new Error("Error comparing passwords");
          });
      })
      .catch((err) => {
        // Catch and log any other errors during the database query
        console.error('Error finding user:', err);
        return done(err); // Pass the error to Passport's error handling
      });
  }
));

// Serialize user to store user data in the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by their ID
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

module.exports = passport;
