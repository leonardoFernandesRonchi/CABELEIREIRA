const express = require("express");

const { verifyToken } = require("@middlewares/authentication");
const router = express.Router();

const { create, destroy } = require("@controllers/schedulingServiceController");

router.post("/", verifyToken, create);

router.delete("/:schedulingServiceId", verifyToken, destroy);

module.exports = router;
