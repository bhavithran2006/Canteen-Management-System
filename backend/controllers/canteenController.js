const { Canteen } = require("../models");

const WAIT_BY_LEVEL = { low: 3, med: 7, high: 14 };

/* ── GET /api/canteens ─────────────────────────────────────────────── */
exports.listCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.findAll({ order: [["id", "ASC"]] });
    return res.json(canteens);
  } catch (err) {
    console.error("listCanteens error:", err);
    return res.status(500).json({ error: "Failed to fetch canteens." });
  }
};

/* ── PATCH /api/canteens/:id/level  [admin] ────────────────────────── */
exports.updateLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { level } = req.body;

    if (!["low", "med", "high"].includes(level))
      return res.status(400).json({ error: "level must be one of: low, med, high." });

    const canteen = await Canteen.findOne({ where: { id } });
    if (!canteen) return res.status(404).json({ error: "Canteen not found." });

    // The beforeSave hook on the model derives wait + lastUpdated automatically
    await canteen.update({ level, wait: WAIT_BY_LEVEL[level], lastUpdated: new Date() });

    const io = req.app.get("io");
    if (io) {
      io.emit("crowd:update", {
        canteenId: canteen.id,
        level: canteen.level,
        wait: canteen.wait,
        lastUpdated: canteen.lastUpdated,
      });
    }

    return res.json(canteen);
  } catch (err) {
    console.error("updateLevel error:", err);
    return res.status(500).json({ error: "Failed to update crowd level." });
  }
};

/* ── PATCH /api/canteens/:id/status [admin] ────────────────────────── */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || typeof status !== "string" || !["active", "inactive"].includes(status.toLowerCase().trim())) {
      return res.status(400).json({
        success: false,
        error: "Status must be either 'active' or 'inactive'.",
        message: "Status must be either 'active' or 'inactive'."
      });
    }

    const normalizedStatus = status.toLowerCase().trim();

    const canteen = await Canteen.findOne({ where: { id } });
    if (!canteen) {
      return res.status(404).json({
        success: false,
        error: `Canteen "${id}" not found.`,
        message: `Canteen "${id}" not found.`
      });
    }

    await canteen.update({ status: normalizedStatus, lastUpdated: new Date() });

    const io = req.app.get("io");
    if (io) {
      io.emit("canteen:status", {
        canteenId: canteen.id,
        status: canteen.status,
        canteen: {
          id: canteen.id,
          name: canteen.name,
          status: canteen.status,
        },
      });
      io.emit("canteen:update", canteen);
    }

    return res.json({
      success: true,
      message: "Canteen status updated successfully",
      canteen: {
        id: canteen.id,
        name: canteen.name,
        status: canteen.status,
        name_ta: canteen.name_ta,
        loc: canteen.loc,
        loc_ta: canteen.loc_ta,
        level: canteen.level,
        wait: canteen.wait,
        lastUpdated: canteen.lastUpdated,
      },
    });
  } catch (err) {
    console.error("updateStatus error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update canteen status.",
      message: "Failed to update canteen status."
    });
  }
};
