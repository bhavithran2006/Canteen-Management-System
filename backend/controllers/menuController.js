const { MenuItem, Notification } = require("../models");

const LOW_STOCK_THRESHOLD = 5;

async function emitLowStockIfNeeded(item, io) {
  if (item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD) {
    const notif = await Notification.create({
      id: `notif-lowstock-${item.id}-${Date.now()}`,
      userId: null,
      text: `⚠️ Low Stock Alert: Only ${item.stock} left for ${item.name}!`,
      read: false,
    });
    if (io) io.emit("notification:new", { notification: notif.toJSON() });
  }
}

/* ── GET /api/menu ─────────────────────────────────────────────────── */
exports.listMenu = async (req, res) => {
  try {
    const items = await MenuItem.findAll({ order: [["category", "ASC"], ["name", "ASC"]] });
    return res.json(items);
  } catch (err) {
    console.error("listMenu error:", err);
    return res.status(500).json({ error: "Failed to fetch menu." });
  }
};

/* ── POST /api/menu  [admin] ───────────────────────────────────────── */
exports.addMenuItem = async (req, res) => {
  try {
    const { id, name, name_ta, price, kcal, category, icon, stock, nutrition, allergens, dietTag, desc } = req.body;
    if (!id || !name || !price || !category)
      return res.status(400).json({ error: "id, name, price and category are required." });

    const existing = await MenuItem.findOne({ where: { id } });
    if (existing) return res.status(409).json({ error: "A menu item with that id already exists." });

    const stockNum = Math.max(0, Number(stock) || 0);
    const item = await MenuItem.create({
      id, name, name_ta: name_ta || "",
      price: Number(price), kcal: Number(kcal) || 0,
      category, icon: icon || "cup",
      stock: stockNum, available: stockNum > 0,
      nutrition: nutrition || {}, allergens: allergens || [],
      dietTag: dietTag || "veg", desc: desc || "",
    });
    return res.status(201).json(item);
  } catch (err) {
    console.error("addMenuItem error:", err);
    return res.status(500).json({ error: "Failed to add menu item." });
  }
};

/* ── PATCH /api/menu/:id/stock  [admin] ───────────────────────────── */
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const newStock = Math.max(0, Number(req.body.stock));

    const item = await MenuItem.findOne({ where: { id } });
    if (!item) return res.status(404).json({ error: "Menu item not found." });

    await item.update({ stock: newStock, available: newStock > 0 });

    const io = req.app.get("io");
    await emitLowStockIfNeeded(item, io);
    return res.json(item);
  } catch (err) {
    console.error("updateStock error:", err);
    return res.status(500).json({ error: "Failed to update stock." });
  }
};

/* ── DELETE /api/menu/:id  [admin] ────────────────────────────────── */
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOne({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: "Menu item not found." });
    const name = item.name;
    await item.destroy();
    return res.json({ message: `${name} removed from menu.` });
  } catch (err) {
    console.error("deleteMenuItem error:", err);
    return res.status(500).json({ error: "Failed to delete menu item." });
  }
};

exports.emitLowStockIfNeeded = emitLowStockIfNeeded;
