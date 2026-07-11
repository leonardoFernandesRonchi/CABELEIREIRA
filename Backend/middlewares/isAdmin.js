const isAdmin = (req, res, next) => {
  if (req.loggedUser.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only admins can access this resource",
    });
  }

  next();
};

module.exports = { isAdmin };
