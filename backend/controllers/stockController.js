const { Op } = require("sequelize");
const { Stock, StockTransaction, FoodIngredient, Notification } = require("../models");

// ── Helper: compute stock status & expiry details ──────────────────────
function computeStockStatus(item) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let isExpired = false;
  let isExpiringSoon = false;
  let daysUntilExpiry = null;

  if (item.expiryDate) {
    const exp = new Date(item.expiryDate);
    exp.setHours(0, 0, 0, 0);
    const diffTime = exp.getTime() - now.getTime();
    daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) {
      isExpired = true;
    } else if (daysUntilExpiry <= 7) {
      isExpiringSoon = true;
    }
  }

  let status = "IN STOCK";
  if (isExpired) {
    status = "EXPIRED";
  } else if (item.quantity === 0) {
    status = "OUT OF STOCK";
  } else if (item.quantity <= item.minimumStockLevel) {
    status = "LOW STOCK";
  }

  const plain = item.toJSON ? item.toJSON() : { ...item };
  return {
    ...plain,
    status,
    isExpired,
    isExpiringSoon,
    daysUntilExpiry,
  };
}

// ── Helper: generate unique stock ID ──────────────────────────────────
async function generateStockId() {
  const lastStock = await Stock.findOne({
    order: [["id", "DESC"]],
  });
  const nextNum = lastStock ? lastStock.id + 1 : 1;
  return `STK-${String(nextNum).padStart(4, "0")}`;
}

// ── Helper: emit alert notification if low stock ──────────────────────
async function emitStockNotificationIfNeeded(stockItem, io) {
  let notifText = null;
  if (stockItem.quantity === 0) {
    notifText = `🚨 Out of Stock Alert: ${stockItem.stockName} is completely out of stock (0 ${stockItem.unit})!`;
  } else if (stockItem.quantity <= stockItem.minimumStockLevel) {
    notifText = `⚠️ Low Stock Alert: Only ${stockItem.quantity} ${stockItem.unit} remaining for ${stockItem.stockName} (Min: ${stockItem.minimumStockLevel} ${stockItem.unit})!`;
  }

  if (notifText) {
    try {
      const notif = await Notification.create({
        id: `notif-stock-${stockItem.id}-${Date.now()}`,
        userId: null, // broadcast to admins/all
        text: notifText,
        read: false,
      });
      if (io) io.emit("notification:new", { notification: notif.toJSON() });
    } catch (e) {
      console.error("Failed to create stock notification:", e.message);
    }
  }
}

/* ── GET /api/admin/stock ─────────────────────────────────────────── */
exports.listStock = async (req, res) => {
  try {
    const { search, category, status, expiry } = req.query;
    const where = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { stockName: { [Op.like]: term } },
        { supplierName: { [Op.like]: term } },
        { stockId: { [Op.like]: term } },
      ];
    }

    const items = await Stock.findAll({
      where,
      order: [
        ["category", "ASC"],
        ["stockName", "ASC"],
      ],
    });

    let formatted = items.map(computeStockStatus);

    // Apply status filter in-memory if needed
    if (status && status !== "all") {
      const target = status.toUpperCase().replace("_", " ");
      formatted = formatted.filter((i) => i.status === target);
    }

    // Apply expiry filter in-memory if needed
    if (expiry && expiry !== "all") {
      if (expiry === "expired") formatted = formatted.filter((i) => i.isExpired);
      if (expiry === "expiring_soon") formatted = formatted.filter((i) => i.isExpiringSoon);
      if (expiry === "normal") formatted = formatted.filter((i) => !i.isExpired && !i.isExpiringSoon);
    }

    return res.json(formatted);
  } catch (err) {
    console.error("listStock error:", err);
    return res.status(500).json({ error: "Failed to fetch stock items." });
  }
};

/* ── GET /api/admin/stock/alerts ──────────────────────────────────── */
exports.getStockAlerts = async (req, res) => {
  try {
    const items = await Stock.findAll();
    const formatted = items.map(computeStockStatus);

    const lowStock = formatted.filter((i) => i.status === "LOW STOCK");
    const outOfStock = formatted.filter((i) => i.status === "OUT OF STOCK");
    const expiringSoon = formatted.filter((i) => i.isExpiringSoon);
    const expired = formatted.filter((i) => i.isExpired);

    return res.json({
      total: formatted.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      expiringSoonCount: expiringSoon.length,
      expiredCount: expired.length,
      lowStock,
      outOfStock,
      expiringSoon,
      expired,
    });
  } catch (err) {
    console.error("getStockAlerts error:", err);
    return res.status(500).json({ error: "Failed to fetch stock alerts." });
  }
};

/* ── GET /api/admin/stock/:id ─────────────────────────────────────── */
exports.getStockById = async (req, res) => {
  try {
    const item = await Stock.findByPk(req.params.id, {
      include: [
        {
          model: StockTransaction,
          as: "transactions",
          limit: 15,
          order: [["date", "DESC"]],
        },
      ],
    });
    if (!item) return res.status(404).json({ error: "Stock item not found." });

    return res.json(computeStockStatus(item));
  } catch (err) {
    console.error("getStockById error:", err);
    return res.status(500).json({ error: "Failed to fetch stock item." });
  }
};

/* ── POST /api/admin/stock ────────────────────────────────────────── */
exports.createStock = async (req, res) => {
  try {
    const {
      stockId,
      stockName,
      category,
      quantity,
      unit,
      minimumStockLevel,
      purchasePrice,
      supplierName,
      purchaseDate,
      expiryDate,
    } = req.body;

    if (!stockName || !stockName.trim()) {
      return res.status(400).json({ error: "Stock name is required." });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({ error: "Quantity must be a non-negative number." });
    }

    const minLevel = Number(minimumStockLevel);
    if (isNaN(minLevel) || minLevel < 0) {
      return res.status(400).json({ error: "Minimum stock level must be a non-negative number." });
    }

    const price = Number(purchasePrice);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ error: "Purchase price must be a non-negative number." });
    }

    const finalStockId = stockId && stockId.trim() ? stockId.trim() : await generateStockId();

    const existing = await Stock.findOne({ where: { stockId: finalStockId } });
    if (existing) {
      return res.status(409).json({ error: `Stock ID "${finalStockId}" already exists.` });
    }

    const stock = await Stock.create({
      stockId: finalStockId,
      stockName: stockName.trim(),
      category: category || "Other",
      quantity: qty,
      unit: unit || "kg",
      minimumStockLevel: minLevel,
      purchasePrice: price,
      supplierName: supplierName || "",
      purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
      expiryDate: expiryDate || null,
    });

    // Record initial transaction
    if (qty > 0) {
      await StockTransaction.create({
        stockId: stock.id,
        stockName: stock.stockName,
        type: "PURCHASE",
        quantity: qty,
        unit: stock.unit,
        previousStock: 0,
        newStock: qty,
        reason: "Initial stock registration",
        supplierName: stock.supplierName,
        purchasePrice: stock.purchasePrice,
        performedBy: req.user?.name || "Admin",
        date: new Date(),
      });
    }

    const io = req.app.get("io");
    await emitStockNotificationIfNeeded(stock, io);

    return res.status(201).json(computeStockStatus(stock));
  } catch (err) {
    console.error("createStock error:", err);
    return res.status(500).json({ error: err.message || "Failed to create stock item." });
  }
};

/* ── PUT /api/admin/stock/:id ─────────────────────────────────────── */
exports.updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ error: "Stock item not found." });

    const {
      stockName,
      category,
      unit,
      minimumStockLevel,
      purchasePrice,
      supplierName,
      purchaseDate,
      expiryDate,
    } = req.body;

    if (stockName !== undefined) {
      if (!stockName.trim()) return res.status(400).json({ error: "Stock name cannot be empty." });
      stock.stockName = stockName.trim();
    }
    if (category !== undefined) stock.category = category;
    if (unit !== undefined) stock.unit = unit;
    if (minimumStockLevel !== undefined) {
      const minVal = Number(minimumStockLevel);
      if (isNaN(minVal) || minVal < 0) return res.status(400).json({ error: "Minimum stock level must be >= 0." });
      stock.minimumStockLevel = minVal;
    }
    if (purchasePrice !== undefined) {
      const pVal = Number(purchasePrice);
      if (isNaN(pVal) || pVal < 0) return res.status(400).json({ error: "Purchase price must be >= 0." });
      stock.purchasePrice = pVal;
    }
    if (supplierName !== undefined) stock.supplierName = supplierName;
    if (purchaseDate !== undefined) stock.purchaseDate = purchaseDate;
    if (expiryDate !== undefined) stock.expiryDate = expiryDate;

    await stock.save();

    const io = req.app.get("io");
    await emitStockNotificationIfNeeded(stock, io);

    return res.json(computeStockStatus(stock));
  } catch (err) {
    console.error("updateStock error:", err);
    return res.status(500).json({ error: "Failed to update stock item." });
  }
};

/* ── DELETE /api/admin/stock/:id ──────────────────────────────────── */
exports.deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ error: "Stock item not found." });

    const name = stock.stockName;
    await stock.destroy();
    return res.json({ message: `Stock item "${name}" deleted successfully.` });
  } catch (err) {
    console.error("deleteStock error:", err);
    return res.status(500).json({ error: "Failed to delete stock item." });
  }
};

/* ── POST /api/admin/stock/:id/add (Purchase stock) ───────────────── */
exports.addStockQuantity = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ error: "Stock item not found." });

    const {
      quantity,
      purchasePrice,
      supplierName,
      purchaseDate,
      expiryDate,
      reason,
    } = req.body;

    const qtyToAdd = Number(quantity);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
      return res.status(400).json({ error: "Quantity to add must be greater than zero." });
    }

    const previousStock = stock.quantity;
    const newStock = Math.round((previousStock + qtyToAdd) * 1000) / 1000;

    stock.quantity = newStock;
    if (supplierName) stock.supplierName = supplierName;
    if (purchasePrice !== undefined) {
      const price = Number(purchasePrice);
      if (price >= 0) stock.purchasePrice = price;
    }
    if (purchaseDate) stock.purchaseDate = purchaseDate;
    if (expiryDate) stock.expiryDate = expiryDate;

    await stock.save();

    // Log transaction
    const tx = await StockTransaction.create({
      stockId: stock.id,
      stockName: stock.stockName,
      type: "PURCHASE",
      quantity: qtyToAdd,
      unit: stock.unit,
      previousStock,
      newStock,
      reason: reason || `Purchased ${qtyToAdd} ${stock.unit} from ${supplierName || stock.supplierName || "supplier"}`,
      supplierName: supplierName || stock.supplierName,
      purchasePrice: purchasePrice !== undefined ? Number(purchasePrice) : stock.purchasePrice,
      performedBy: req.user?.name || "Admin",
      date: new Date(),
    });

    return res.status(200).json({
      stock: computeStockStatus(stock),
      transaction: tx,
    });
  } catch (err) {
    console.error("addStockQuantity error:", err);
    return res.status(500).json({ error: "Failed to add stock quantity." });
  }
};

/* ── POST /api/admin/stock/:id/reduce ─────────────────────────────── */
exports.reduceStockQuantity = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ error: "Stock item not found." });

    const { quantity, reason, notes, type } = req.body;

    const qtyToReduce = Number(quantity);
    if (isNaN(qtyToReduce) || qtyToReduce <= 0) {
      return res.status(400).json({ error: "Quantity to reduce must be greater than zero." });
    }

    if (qtyToReduce > stock.quantity) {
      return res.status(400).json({
        error: `Insufficient stock. Only ${stock.quantity} ${stock.unit} of ${stock.stockName} is available.`,
      });
    }

    const previousStock = stock.quantity;
    const newStock = Math.round(Math.max(0, previousStock - qtyToReduce) * 1000) / 1000;

    stock.quantity = newStock;
    await stock.save();

    // Map reason to valid transaction type enum
    let txType = "USED";
    const validTypes = ["PURCHASE", "USED", "WASTAGE", "DAMAGED", "EXPIRED", "FOOD_PREPARATION", "ADJUSTMENT", "RETURN"];
    if (type && validTypes.includes(type.toUpperCase())) {
      txType = type.toUpperCase();
    } else if (reason) {
      const lower = reason.toLowerCase();
      if (lower.includes("wastage") || lower.includes("spoil")) txType = "WASTAGE";
      else if (lower.includes("damage")) txType = "DAMAGED";
      else if (lower.includes("expir")) txType = "EXPIRED";
      else if (lower.includes("prep") || lower.includes("cook")) txType = "FOOD_PREPARATION";
      else if (lower.includes("adjust")) txType = "ADJUSTMENT";
      else if (lower.includes("return")) txType = "RETURN";
    }

    const fullReason = [reason, notes].filter(Boolean).join(" — ") || "Manual stock reduction";

    const tx = await StockTransaction.create({
      stockId: stock.id,
      stockName: stock.stockName,
      type: txType,
      quantity: -qtyToReduce,
      unit: stock.unit,
      previousStock,
      newStock,
      reason: fullReason,
      supplierName: stock.supplierName,
      purchasePrice: stock.purchasePrice,
      performedBy: req.user?.name || "Admin",
      date: new Date(),
    });

    const io = req.app.get("io");
    await emitStockNotificationIfNeeded(stock, io);

    return res.status(200).json({
      stock: computeStockStatus(stock),
      transaction: tx,
    });
  } catch (err) {
    console.error("reduceStockQuantity error:", err);
    return res.status(500).json({ error: "Failed to reduce stock quantity." });
  }
};

/* ── GET /api/admin/stock/:id/history ─────────────────────────────── */
exports.getStockItemHistory = async (req, res) => {
  try {
    const transactions = await StockTransaction.findAll({
      where: { stockId: req.params.id },
      order: [["date", "DESC"]],
    });
    return res.json(transactions);
  } catch (err) {
    console.error("getStockItemHistory error:", err);
    return res.status(500).json({ error: "Failed to fetch item history." });
  }
};

/* ── GET /api/admin/stock/history ─────────────────────────────────── */
exports.getAllStockHistory = async (req, res) => {
  try {
    const { stockId, type, supplier, startDate, endDate, limit } = req.query;
    const where = {};

    if (stockId) where.stockId = stockId;
    if (type && type !== "all") where.type = type.toUpperCase();
    if (supplier && supplier.trim()) {
      where.supplierName = { [Op.like]: `%${supplier.trim()}%` };
    }
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      where.date = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      where.date = { [Op.lte]: new Date(endDate) };
    }

    const transactions = await StockTransaction.findAll({
      where,
      order: [["date", "DESC"]],
      limit: Number(limit) || 100,
    });

    return res.json(transactions);
  } catch (err) {
    console.error("getAllStockHistory error:", err);
    return res.status(500).json({ error: "Failed to fetch stock history." });
  }
};

exports.computeStockStatus = computeStockStatus;
exports.emitStockNotificationIfNeeded = emitStockNotificationIfNeeded;
