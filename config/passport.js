const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

// Passport configuration
passport.use(
    new LocalStrategy((username, password, done) => {
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
                        console.error('Error comparing passwords:', err);
                        return done(err);
                    });
            })
            .catch((err) => {
                console.error('Error finding user:', err);
                return done(err);
            });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user); // Attach the user to req.user
    } catch (err) {
      done(err);
    }
  });

module.exports = passport;