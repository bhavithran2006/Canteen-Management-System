const { Feedback } = require("../models");

/* ── GET /api/feedback ─────────────────────────────────────────────── */
exports.listFeedback = async (req, res) => {
  try {
    const items = await Feedback.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch feedback." });
  }
};

/* ── POST /api/feedback ────────────────────────────────────────────── */
exports.addFeedback = async (req, res) => {
  try {
    const { rating, category, item, tags, comment } = req.body;
    const fb = await Feedback.create({
      id: "fb-" + Date.now(),
      author: req.user.name,
      roll: req.user.id,
      rating: Number(rating) || 5,
      category: category || "food_quality",
      item: item || null,
      tags: Array.isArray(tags) ? tags : [],
      comment: comment || "",
      date: "Just now",
      helpful: 0,
      managerReply: null,
    });
    return res.status(201).json(fb);
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit feedback." });
  }
};

/* ── PATCH /api/feedback/:id/upvote ───────────────────────────────── */
exports.upvoteFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findOne({ where: { id: req.params.id } });
    if (!fb) return res.status(404).json({ error: "Feedback not found." });
    await fb.update({ helpful: fb.helpful + 1 });
    return res.json(fb);
  } catch (err) {
    return res.status(500).json({ error: "Failed to upvote feedback." });
  }
};

/* ── PATCH /api/feedback/:id/reply  [admin] ───────────────────────── */
exports.replyToFeedback = async (req, res) => {
  try {
    const { managerReply } = req.body;
    if (!managerReply) return res.status(400).json({ error: "managerReply text is required." });

    const fb = await Feedback.findOne({ where: { id: req.params.id } });
    if (!fb) return res.status(404).json({ error: "Feedback not found." });
    await fb.update({ managerReply });
    return res.json(fb);
  } catch (err) {
    return res.status(500).json({ error: "Failed to post manager reply." });
  }
};
