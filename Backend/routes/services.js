const express = require("express");
const router = express.Router();
const { create, update, destroy } = require("../controllers/serviceController");
const { verifyToken } = require("@middlewares/authentication");
const { isAdmin } = require("@middlewares/isAdmin");

router.post("/", verifyToken, isAdmin, create);
router.put("/:serviceId", verifyToken, isAdmin, update);
router.delete("/:serviceId", verifyToken, isAdmin, destroy);

module.exports = router;
