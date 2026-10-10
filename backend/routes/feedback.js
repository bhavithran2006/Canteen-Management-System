const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
  listFeedback,
  addFeedback,
  upvoteFeedback,
  replyToFeedback,
} = require("../controllers/feedbackController");

router.get("/", listFeedback);
router.post("/", auth, addFeedback);
router.patch("/:id/upvote", auth, upvoteFeedback);
router.patch("/:id/reply", auth, adminOnly, replyToFeedback);

module.exports = router;
