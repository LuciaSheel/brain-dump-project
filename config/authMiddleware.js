module.exports.isAuthenticated = (req, res, next) => {

  // Check if user is authenticated via Passport
  if (req.isAuthenticated()) {
    console.log('User authenticated', req.user);
    return next(); // If authenticated, continue to the next middleware or route handler
  }
  console.log('User not authenticated');
  // If not authenticated, send a JSON error response
  return res.status(401).json({ message: 'You must be logged in to access this resource.' });
};