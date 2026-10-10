const { Op } = require("sequelize");
const { Notification } = require("../models");

/* ── GET /api/notifications ────────────────────────────────────────── */
exports.listNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        [Op.or]: [{ userId: req.user.id }, { userId: null }],
      },
      order: [["createdAt", "DESC"]],
    });
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

/* ── PATCH /api/notifications/read-all ────────────────────────────── */
exports.markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      {
        where: {
          [Op.or]: [{ userId: req.user.id }, { userId: null }],
          read: false,
        },
      }
    );
    return res.json({ message: "All notifications marked as read." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to mark notifications as read." });
  }
};
