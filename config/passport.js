const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

// Configure Passport to use the LocalStrategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        user.comparePassword(password)
          .then((isMatch) => {
            if (!isMatch) {
              return done(null, false, { message: 'Incorrect username or password.' });
            }
            return done(null, user); // User is authenticated
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
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
