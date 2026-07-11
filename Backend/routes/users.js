const express = require("express");
const router = express.Router();
const { signUp, signIn, me, logOut } = require("../controllers/userController");
const { verifyToken } = require("@middlewares/authentication");

router.post("/", signUp);
router.post("/signin", signIn);
router.delete("/logout", verifyToken, logOut);
router.get("/me", verifyToken, me);

module.exports = router;
