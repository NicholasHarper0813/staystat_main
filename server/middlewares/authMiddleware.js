const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const checkAuth = async (req, res, next) => {
  const { authtoken } = req.headers;
  if (!authtoken) {
    return res.status(401).json({
      message: "You are not authorized or deactivated by admin",
    });
  } else {
    try {
      const { id } = jwt.verify(authtoken, process.env.JWT_SECRET);
      const user = await User.findById(id);
      if (!user || !user?.isActive) {
        return res.status(201).json({
          message: "You are not authorized or deactivated by admin",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(201).json({
        message: "You are not authorized or deactivated by admin",
      });
    }
  }
};

module.exports = checkAuth;
