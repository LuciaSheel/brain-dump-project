module.exports.isAuthenticated = (req, res, next) => {

  // Check if user is authenticated via Passport
  if (req.isAuthenticated()) {
    return next(); // If authenticated, continue to the next middleware or route handler
  }
  
  // If not authenticated, send a JSON error response
  return res.status(401).json({ message: 'You must be logged in to access this resource.' });
};