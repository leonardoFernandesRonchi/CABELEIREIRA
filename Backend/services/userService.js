const { User } = require("../models");
const { jwtSign } = require("../helpers/jwt");
const { bcryptHash, bcryptCompare } = require("../helpers/bcrypt");
const {
  FieldRequiredError,
  AlreadyTakenError,
} = require("../helpers/customErrors");

async function signUpService({ username, email, password }) {
  if (!username) throw new FieldRequiredError(`A username`);
  if (!email) throw new FieldRequiredError(`An email`);
  if (!password) throw new FieldRequiredError(`A password`);

  const userExists = await User.findOne({ where: { email } });
  if (userExists) throw new AlreadyTakenError("Email");

  const newUser = await User.create({
    email,
    username,
    password: await bcryptHash(password),
  });

  const token = await jwtSign({ id: newUser.id, email: newUser.email });

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    },
    token,
  };
}

async function signInService({ email, password }) {
  if (!email) throw new FieldRequiredError(`An email`);
  if (!password) throw new FieldRequiredError(`A password`);

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  if (!(await bcryptCompare(password, user.password)))
    throw new Error("Invalid credentials");

  const token = await jwtSign({ id: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    token,
  };
}

module.exports = { signUpService, signInService };
