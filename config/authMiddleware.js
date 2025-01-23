module.exports.isAuthenticated = (req, res, next) => {

  // Check if user is authenticated via Passport
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({ message: 'You must be logged in to access this resource.' });
};