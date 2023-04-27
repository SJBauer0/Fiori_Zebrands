exports.clearInvalidCookies = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.clearCookie('connect.sid');
  }
  next();
};
