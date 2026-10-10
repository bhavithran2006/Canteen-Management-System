const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { listNotifications, markAllRead } = require("../controllers/notificationController");

router.get("/", auth, listNotifications);
router.patch("/read-all", auth, markAllRead);

module.exports = router;
