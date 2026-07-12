const { signUpService, signInService } = require("@services/userService");

const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    await signUpService({ username, email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await signInService({ email, password });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: user });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const logOut = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Deslogado com sucesso" });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  try {
    res.status(200).json({ user: req.loggedUser });
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { signUp, signIn, logOut, me };
