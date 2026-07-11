const express = require("express");
const router = express.Router();
const {
  create,
  update,
  destroy,
  getMy,
  getAll,
} = require("../controllers/schedulingController");
const { verifyToken } = require("@middlewares/authentication");
const { isAdmin } = require("@middlewares/isAdmin");

router.post("/", verifyToken, create);
router.put("/:schedulingId", verifyToken, update);
router.delete("/:schedulingId", verifyToken, destroy);
router.get("/my", verifyToken, getMy);
router.get("/", verifyToken, isAdmin, getAll);

module.exports = router;
