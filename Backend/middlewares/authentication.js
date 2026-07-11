const { jwtVerify } = require("@helpers/jwt");
const { User } = require("@models");

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token && req.cookies?.token) {
      token = req.headers.cookie
        .split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];
    }

    if (!token) {
      req.loggedUser = null;
      return next();
    }

    const userVerified = await jwtVerify(token);

    const user = await User.findOne({
      where: { email: userVerified.email },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      req.loggedUser = null;
      return next();
    }

    req.loggedUser = user;
    next();
  } catch (err) {
    req.loggedUser = null;
    next(err);
  }
};

module.exports = { verifyToken };
