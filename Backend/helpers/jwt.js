require("dotenv").config();
const jwt = require("jsonwebtoken");

const privateKey = process.env.JWT_SECRET;

module.exports.jwtSign = async (payload) => {
  return jwt.sign(
    { username: payload.username, email: payload.email },
    privateKey,
  );
};

module.exports.jwtVerify = async (token) => {
  return jwt.verify(token, privateKey);
};
