const { FoodIngredient, Stock, MenuItem } = require("../models");

/* ── GET /api/admin/menu-ingredients/:menuItemId? ─────────────────── */
exports.getRecipeIngredients = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId || req.query.menuItemId;
    const where = {};
    if (menuItemId) {
      where.menuItemId = menuItemId;
    }

    const ingredients = await FoodIngredient.findAll({
      where,
      include: [
        {
          model: Stock,
          as: "stockItem",
          attributes: ["id", "stockId", "stockName", "category", "quantity", "unit", "minimumStockLevel"],
        },
        {
          model: MenuItem,
          as: "menuItem",
          attributes: ["id", "name", "name_ta", "category", "price", "stock"],
        },
      ],
      order: [["menuItemId", "ASC"], ["id", "ASC"]],
    });

    return res.json(ingredients);
  } catch (err) {
    console.error("getRecipeIngredients error:", err);
    return res.status(500).json({ error: "Failed to fetch recipe ingredients." });
  }
};

/* ── POST /api/admin/menu-ingredients ─────────────────────────────── */
exports.saveRecipeIngredient = async (req, res) => {
  try {
    const { menuItemId, stockId, quantity, unit, notes } = req.body;

    if (!menuItemId) return res.status(400).json({ error: "menuItemId is required." });
    if (!stockId) return res.status(400).json({ error: "stockId is required." });

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "Ingredient quantity must be a positive number." });
    }

    const menuItem = await MenuItem.findByPk(menuItemId);
    if (!menuItem) return res.status(404).json({ error: `Menu item "${menuItemId}" not found.` });

    const stockItem = await Stock.findByPk(stockId);
    if (!stockItem) return res.status(404).json({ error: `Stock item "${stockId}" not found.` });

    // Check if mapping already exists
    let mapping = await FoodIngredient.findOne({
      where: { menuItemId, stockId },
    });

    if (mapping) {
      mapping.quantity = qty;
      mapping.unit = unit || stockItem.unit;
      if (notes !== undefined) mapping.notes = notes;
      await mapping.save();
    } else {
      mapping = await FoodIngredient.create({
        menuItemId,
        stockId,
        quantity: qty,
        unit: unit || stockItem.unit,
        notes: notes || "",
      });
    }

    const reloaded = await FoodIngredient.findByPk(mapping.id, {
      include: [
        { model: Stock, as: "stockItem" },
        { model: MenuItem, as: "menuItem" },
      ],
    });

    return res.status(200).json(reloaded);
  } catch (err) {
    console.error("saveRecipeIngredient error:", err);
    return res.status(500).json({ error: "Failed to save recipe ingredient." });
  }
};

/* ── DELETE /api/admin/menu-ingredients/:id ───────────────────────── */
exports.deleteRecipeIngredient = async (req, res) => {
  try {
    const mapping = await FoodIngredient.findByPk(req.params.id);
    if (!mapping) return res.status(404).json({ error: "Ingredient mapping not found." });

    await mapping.destroy();
    return res.json({ message: "Ingredient mapping removed successfully." });
  } catch (err) {
    console.error("deleteRecipeIngredient error:", err);
    return res.status(500).json({ error: "Failed to delete recipe ingredient." });
  }
};
