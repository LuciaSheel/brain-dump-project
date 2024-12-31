module.exports.isAuthenticated = (req, res, next) => {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    return next(); // If authenticated, continue to the next middleware or route handler
  }
  // If not authenticated, redirect to login page
  res.redirect('/login');
};