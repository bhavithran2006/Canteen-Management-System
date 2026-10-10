const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const { listCanteens, updateLevel, updateStatus } = require("../controllers/canteenController");

router.get("/", listCanteens);
router.patch("/:id/level", auth, adminOnly, updateLevel);
router.patch("/:id/status", auth, adminOnly, updateStatus);

module.exports = router;
