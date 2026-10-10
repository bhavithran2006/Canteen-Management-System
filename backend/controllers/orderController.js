const crypto = require("crypto");
const QRCode = require("qrcode");
const { Op } = require("sequelize");
const { Order, MenuItem, Notification, Stock, StockTransaction, FoodIngredient, Canteen, sequelize } = require("../models");
const { emitLowStockIfNeeded } = require("./menuController");
const { emitStockNotificationIfNeeded } = require("./stockController");

function genOrderId() { return "ORD-" + String(Math.floor(1000 + Math.random() * 9000)); }
function genToken()   { return "A-"   + String(Math.floor(1 + Math.random() * 98)).padStart(2, "0"); }
function genQrToken() { return "QR-"  + crypto.randomBytes(16).toString("hex").toUpperCase(); }

// ── Unit conversion helper ──────────────────────────────────────────
function convertQuantity(qty, fromUnit, toUnit) {
  const from = (fromUnit || "").toLowerCase().trim();
  const to = (toUnit || "").toLowerCase().trim();

  if (!from || !to || from === to) return qty;

  // Mass: kg <-> gram
  if (from === "gram" && to === "kg") return qty / 1000;
  if (from === "kg" && to === "gram") return qty * 1000;

  // Volume: ml <-> litre
  if (from === "ml" && to === "litre") return qty / 1000;
  if (from === "litre" && to === "ml") return qty * 1000;

  // Count: piece <-> dozen
  if (from === "piece" && to === "dozen") return qty / 12;
  if (from === "dozen" && to === "piece") return qty * 12;

  return qty;
}

/* ── POST /api/orders ──────────────────────────────────────────────── */
exports.placeOrder = async (req, res) => {
  try {
    const { items: rawItems, paymentMode, canteenId } = req.body;
    const userId = req.user.id;

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0)
      return res.status(400).json({ error: "items array is required and must not be empty." });

    if (!canteenId)
      return res.status(400).json({ error: "canteenId is required. Please select a canteen before placing an order." });

    // ── Look up canteen ──────────────────────────────────────────────
    const canteen = await Canteen.findOne({ where: { id: canteenId } });
    if (!canteen) {
      return res.status(400).json({
        success: false,
        error: `Canteen "${canteenId}" not found.`,
        message: `Canteen "${canteenId}" not found.`
      });
    }

    if (canteen.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This canteen is currently inactive. Please choose another canteen.",
        error: "This canteen is currently inactive. Please choose another canteen."
      });
    }

    const canteenName = canteen.name;
    const canteenLoc = canteen.loc || "";

    // ── Validate stock & compute server-side total ──────────────────
    let total = 0;
    const orderItems = [];

    for (const raw of rawItems) {
      const menuItem = await MenuItem.findOne({ where: { id: raw.id } });
      if (!menuItem)
        return res.status(400).json({ error: `Menu item "${raw.id}" not found.` });
      if (!menuItem.available || menuItem.stock < raw.qty)
        return res.status(400).json({ error: `Insufficient stock for "${menuItem.name}". Available: ${menuItem.stock}.` });

      total += menuItem.price * raw.qty;
      orderItems.push({ id: menuItem.id, name: menuItem.name, name_ta: menuItem.name_ta, price: menuItem.price, qty: raw.qty });
    }

    // ── Decrement stock ──────────────────────────────────────────────
    const io = req.app.get("io");
    for (const oi of orderItems) {
      const mi = await MenuItem.findOne({ where: { id: oi.id } });
      if (mi) {
        const newStock = Math.max(0, mi.stock - oi.qty);
        await mi.update({ stock: newStock, available: newStock > 0 });
        await emitLowStockIfNeeded(mi, io);
      }
    }

    // Generate unique, secure QR token for every order
    const qrToken = genQrToken();

    const order = await Order.create({
      id: genOrderId(),
      userId,
      items: orderItems,
      total,
      paymentMode: paymentMode || "UPI / GPay",
      paymentStatus: "PENDING",
      token: genToken(),
      issuedTime: new Date(),
      completedTime: null,
      status: -2, // -2 = Awaiting Payment
      counter: Math.floor(1 + Math.random() * 3),
      canteenId,
      canteenName,
      canteenLoc,
      qrToken,
      qrUsed: false,
    });

    if (io) io.to(userId).emit("order:status", { orderId: order.id, status: -2, userId });
    return res.status(201).json(order);
  } catch (err) {
    console.error("placeOrder error:", err);
    return res.status(500).json({ error: "Failed to place order." });
  }
};

/* ── GET /api/orders/:id  ─────────────────────────────────────────── */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (req.user.role !== "admin" && order.userId !== req.user.id)
      return res.status(403).json({ error: "Not authorized to view this order." });
    return res.json(order);
  } catch (err) {
    console.error("getOrderById error:", err);
    return res.status(500).json({ error: "Failed to fetch order." });
  }
};

/* ── POST /api/orders/:id/payment  ────────────────────────────────── */
exports.confirmPayment = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const { paymentMethod, upiId, cardLastFour, transactionRef } = req.body;

    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (order.userId !== userId)
      return res.status(403).json({ error: "Not authorized to pay for this order." });
    if (order.status !== -2)
      return res.status(400).json({ error: "Order is not in awaiting-payment state." });

    // Ensure selected canteen is still active before accepting payment
    if (order.canteenId) {
      const canteen = await Canteen.findOne({ where: { id: order.canteenId } });
      if (canteen && canteen.status !== "active") {
        return res.status(400).json({
          success: false,
          error: "This canteen is currently inactive. Please choose another canteen.",
          message: "This canteen is currently inactive. Please choose another canteen."
        });
      }
    }

    const { User } = require("../models");
    const io = req.app.get("io");

    let finalPaymentStatus = "PAID";
    let finalPaymentMode = paymentMethod || order.paymentMode;
    let refId = transactionRef || `TXN-${Date.now()}`;

    // ── Wallet payment: check & deduct balance ──────────────────────
    if (paymentMethod === "WALLET") {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: "User not found." });
      if (user.walletBalance < order.total)
        return res.status(400).json({
          error: `Insufficient wallet balance. Available: ₹${user.walletBalance.toFixed(2)}, Required: ₹${order.total.toFixed(2)}.`,
          insufficientBalance: true,
          walletBalance: user.walletBalance,
          required: order.total,
        });
      await user.update({ walletBalance: user.walletBalance - order.total });
      refId = `WALLET-${Date.now()}`;
    }

    // ── Cash at canteen: keep payment pending ───────────────────────
    if (paymentMethod === "CASH") {
      finalPaymentStatus = "PENDING";
      refId = `CASH-${Date.now()}`;
    }

    // ── Build safe payment info (NEVER store CVV) ───────────────────
    const safePaymentInfo = {
      method: finalPaymentMode,
      status: finalPaymentStatus,
      transactionRef: refId,
      ...(upiId ? { upiId } : {}),
      ...(cardLastFour ? { cardLastFour } : {}),
      paidAt: new Date().toISOString(),
    };

    // ── Confirm order: set status=0 (Placed/Confirmed) ──────────────
    await order.update({
      status: 0,
      paymentStatus: finalPaymentStatus,
      paymentMode: finalPaymentMode,
      transactionRef: refId,
    });

    if (io) {
      io.to(userId).emit("order:status", { orderId: order.id, status: 0, userId });
      const notif = await Notification.create({
        id: `notif-order-${order.id}-${Date.now()}`,
        userId,
        text: `✅ Order ${order.id} confirmed! Payment ${finalPaymentStatus === "PAID" ? "received" : "pending (cash)"}. Pickup at ${order.canteenName}.`,
        read: false,
      });
      io.to(userId).emit("notification:new", { notification: notif.toJSON() });
    }

    return res.json({
      success: true,
      order: {
        id: order.id,
        userId: order.userId,
        canteenId: order.canteenId,
        canteenName: order.canteenName,
        canteenLoc: order.canteenLoc,
        items: order.items,
        total: order.total,
        status: 0,
        paymentStatus: finalPaymentStatus,
        paymentMode: finalPaymentMode,
        transactionRef: refId,
        token: order.token,
        counter: order.counter,
        qrToken: order.qrToken,
        issuedTime: order.issuedTime,
        paymentInfo: safePaymentInfo,
      },
    });
  } catch (err) {
    console.error("confirmPayment error:", err);
    return res.status(500).json({ error: "Failed to confirm payment." });
  }
};

/* ── GET /api/orders/active ───────────────────────────────────────── */
exports.getActiveOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { userId: req.user.id, status: { [Op.between]: [0, 2] } },
      order: [["issuedTime", "DESC"]],
    });
    return res.json(order || null);
  } catch (err) {
    console.error("getActiveOrder error:", err);
    return res.status(500).json({ error: "Failed to fetch active order." });
  }
};

/* ── GET /api/orders/history ──────────────────────────────────────── */
exports.getOrderHistory = async (req, res) => {
  try {
    const where = req.user.role === "admin"
      ? {}
      : { userId: req.user.id };

    const orders = await Order.findAll({ where, order: [["issuedTime", "DESC"]] });
    return res.json(orders);
  } catch (err) {
    console.error("getOrderHistory error:", err);
    return res.status(500).json({ error: "Failed to fetch order history." });
  }
};

/* ── GET /api/orders/:id/qr  [customer or admin] ─────────────────── */
exports.getOrderQrPass = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "Order not found." });

    // Authorization: customer can only view their own QR pass
    if (req.user.role !== "admin" && order.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view this QR Pickup Pass." });
    }

    // Ensure order has a secure QR token
    if (!order.qrToken) {
      order.qrToken = genQrToken();
      await order.save();
    }

    // Secure payload for QR representation — contains only unguessable token and metadata
    const qrPayload = JSON.stringify({
      t: order.qrToken,
      oid: order.id,
      c: order.canteenId,
    });

    // Generate high-resolution base64 QR code data URL
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: "H",
      margin: 1.5,
      width: 280,
      color: {
        dark: "#1e293b",
        light: "#ffffff",
      },
    });

    return res.json({
      orderId: order.id,
      token: order.token,
      qrToken: order.qrToken,
      qrPayload,
      qrDataUrl,
      canteenId: order.canteenId,
      canteenName: order.canteenName,
      canteenLoc: order.canteenLoc,
      counter: order.counter,
      status: order.status,
      qrUsed: order.qrUsed,
      pickedUpAt: order.pickedUpAt,
      pickedUpByStaffName: order.pickedUpByStaffName,
      paymentMode: order.paymentMode,
      paymentStatus: order.paymentStatus || "PAID",
      total: order.total,
      items: order.items,
      issuedTime: order.issuedTime,
    });
  } catch (err) {
    console.error("getOrderQrPass error:", err);
    return res.status(500).json({ error: "Failed to generate QR Pickup Pass." });
  }
};

/* ── POST /api/orders/qr-verify  [staff/admin] ────────────────────── */
exports.verifyQrToken = async (req, res) => {
  try {
    let { qrToken, staffCanteenId } = req.body;
    if (!qrToken || typeof qrToken !== "string" || !qrToken.trim()) {
      return res.status(400).json({ error: "QR token or Token string is required." });
    }

    qrToken = qrToken.trim();

    // If staff scanned JSON QR payload, parse it
    let lookupToken = qrToken;
    let payloadOrderId = null;
    let payloadCanteenId = null;

    if (qrToken.startsWith("{") && qrToken.endsWith("}")) {
      try {
        const parsed = JSON.parse(qrToken);
        lookupToken = parsed.t || parsed.qrToken || parsed.oid || qrToken;
        payloadOrderId = parsed.oid;
        payloadCanteenId = parsed.c;
      } catch (e) {}
    }

    // Look up by qrToken, order id, or token number (for manual entry)
    const order = await Order.findOne({
      where: {
        [Op.or]: [
          { qrToken: lookupToken },
          { id: lookupToken },
          { token: lookupToken },
          ...(payloadOrderId ? [{ id: payloadOrderId }] : []),
        ],
      },
    });

    if (!order) {
      return res.status(404).json({
        valid: false,
        error: "Invalid QR code. No matching order found in the system.",
      });
    }

    // Check if already picked up / used
    if (order.status === 3 || order.qrUsed) {
      return res.status(400).json({
        valid: false,
        alreadyCollected: true,
        error: "This order has already been collected.",
        order: {
          id: order.id,
          token: order.token,
          canteenName: order.canteenName,
          canteenId: order.canteenId,
          status: order.status,
          items: order.items,
          total: order.total,
          paymentMode: order.paymentMode,
          paymentStatus: order.paymentStatus || "PAID",
          pickedUpAt: order.pickedUpAt || order.completedTime,
          pickedUpByStaffName: order.pickedUpByStaffName || "Canteen Staff",
        },
      });
    }

    // Check cancelled status
    if (order.status === -1) {
      return res.status(400).json({
        valid: false,
        isCancelled: true,
        error: "This order has been cancelled and cannot be picked up.",
        order,
      });
    }

    // Canteen enforcement: staff can only collect orders for their assigned canteen
    if (staffCanteenId && order.canteenId && staffCanteenId !== order.canteenId) {
      return res.status(403).json({
        valid: false,
        canteenMismatch: true,
        error: `Canteen mismatch! This order was placed at "${order.canteenName || order.canteenId}". Staff at this canteen cannot collect this order.`,
        order: {
          id: order.id,
          token: order.token,
          canteenName: order.canteenName,
          canteenId: order.canteenId,
          assignedCanteenId: staffCanteenId,
        },
      });
    }

    const isReady = order.status === 2;
    const isPreparing = order.status === 1;
    const isPlaced = order.status === 0;

    return res.json({
      valid: true,
      order: {
        id: order.id,
        userId: order.userId,
        token: order.token,
        qrToken: order.qrToken,
        canteenId: order.canteenId,
        canteenName: order.canteenName,
        canteenLoc: order.canteenLoc,
        counter: order.counter,
        status: order.status,
        items: order.items,
        total: order.total,
        paymentMode: order.paymentMode,
        paymentStatus: order.paymentStatus || "PAID",
        issuedTime: order.issuedTime,
        qrUsed: order.qrUsed,
      },
      isReady,
      isPreparing,
      isPlaced,
      canPickup: isReady || isPreparing || isPlaced,
      message: isReady
        ? "✅ Order verified! Order is ready for handover."
        : `⚠️ Order verified, but current status is ${isPreparing ? "Preparing" : "Placed"}. You may confirm handover when prepared.`,
    });
  } catch (err) {
    console.error("verifyQrToken error:", err);
    return res.status(500).json({ error: "Failed to verify QR token." });
  }
};

/* ── POST /api/orders/qr-confirm  [staff/admin] ────────────────────── */
exports.confirmQrPickup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { qrToken, staffCanteenId } = req.body;
    if (!qrToken || typeof qrToken !== "string") {
      await t.rollback();
      return res.status(400).json({ error: "QR token or Token string is required." });
    }

    qrToken = qrToken.trim();
    let lookupToken = qrToken;

    if (qrToken.startsWith("{") && qrToken.endsWith("}")) {
      try {
        const parsed = JSON.parse(qrToken);
        lookupToken = parsed.t || parsed.qrToken || parsed.oid || qrToken;
      } catch (e) {}
    }

    // Lock row for update to prevent concurrent duplicate scans
    const order = await Order.findOne({
      where: {
        [Op.or]: [
          { qrToken: lookupToken },
          { id: lookupToken },
          { token: lookupToken },
        ],
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: "Order not found." });
    }

    // Prevent duplicate pickup confirmation
    if (order.status === 3 || order.qrUsed) {
      await t.rollback();
      return res.status(400).json({
        error: "This order has already been collected.",
        alreadyCollected: true,
        pickedUpAt: order.pickedUpAt || order.completedTime,
        pickedUpByStaffName: order.pickedUpByStaffName,
      });
    }

    // Canteen enforcement
    if (staffCanteenId && order.canteenId && staffCanteenId !== order.canteenId) {
      await t.rollback();
      return res.status(403).json({
        error: `Canteen mismatch! This order belongs to "${order.canteenName}". You cannot confirm pickup from another canteen.`,
      });
    }

    // Deduct ingredients if not yet deducted
    if (!order.ingredientsDeducted) {
      const orderItems = order.items || [];
      const deductions = [];

      for (const item of orderItems) {
        const ingredients = await FoodIngredient.findAll({
          where: { menuItemId: item.id },
          include: [{ model: Stock, as: "stockItem" }],
          transaction: t,
        });

        for (const ing of ingredients) {
          const stock = ing.stockItem;
          if (stock) {
            const rawNeeded = item.qty * ing.quantity;
            const convertedNeeded = convertQuantity(rawNeeded, ing.unit, stock.unit);
            deductions.push({
              stock,
              needed: Math.round(convertedNeeded * 10000) / 10000,
              dishName: item.name,
              dishQty: item.qty,
            });
          }
        }
      }

      for (const d of deductions) {
        const prev = d.stock.quantity;
        const updatedQty = Math.round(Math.max(0, prev - d.needed) * 1000) / 1000;
        d.stock.quantity = updatedQty;
        await d.stock.save({ transaction: t });

        await StockTransaction.create({
          stockId: d.stock.id,
          stockName: d.stock.stockName,
          type: "FOOD_PREPARATION",
          quantity: -d.needed,
          unit: d.stock.unit,
          previousStock: prev,
          newStock: updatedQty,
          reason: `Handover pickup: ${d.dishQty}× ${d.dishName} for order ${order.id}`,
          supplierName: d.stock.supplierName,
          purchasePrice: d.stock.purchasePrice,
          performedBy: req.user?.name || "Staff",
          orderId: order.id,
          date: new Date(),
        }, { transaction: t });
      }

      order.ingredientsDeducted = true;
    }

    const now = new Date();
    const staffId = req.user.id;
    const staffName = req.user.name || "Canteen Staff";

    order.status = 3;
    order.qrUsed = true;
    order.pickedUpAt = now;
    order.completedTime = now;
    order.pickedUpByStaffId = staffId;
    order.pickedUpByStaffName = staffName;

    await order.save({ transaction: t });
    await t.commit();

    // Socket.io real-time update to customer room
    const io = req.app.get("io");
    if (io) {
      io.to(order.userId).emit("order:status", {
        orderId: order.id,
        status: 3,
        userId: order.userId,
        pickedUp: true,
        pickedUpAt: now,
        staffName,
      });

      // Notification
      const notif = await Notification.create({
        id: `notif-pickup-${order.id}-${Date.now()}`,
        userId: order.userId,
        text: `✅ Order ${order.id} (Token ${order.token}) has been picked up from ${order.canteenName}. Thank you!`,
        read: false,
      });
      io.to(order.userId).emit("notification:new", { notification: notif.toJSON() });
    }

    return res.json({
      success: true,
      message: "Order successfully collected. Thank you!",
      order: {
        id: order.id,
        token: order.token,
        canteenName: order.canteenName,
        status: 3,
        qrUsed: true,
        pickedUpAt: now,
        pickedUpByStaffName: staffName,
      },
    });
  } catch (err) {
    await t.rollback();
    console.error("confirmQrPickup error:", err);
    return res.status(500).json({ error: "Failed to confirm pickup." });
  }
};

/* ── PATCH /api/orders/:id/advance  [admin] ───────────────────────── */
exports.advanceOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (order.status < 0)  return res.status(400).json({ error: "Cannot advance a cancelled order." });
    if (order.status >= 3) return res.status(400).json({ error: "Order is already completed." });

    const newStatus = order.status + 1;
    const io = req.app.get("io");

    // ── Automatic Raw Material Stock Deduction ──────────────────────
    if (newStatus >= 1 && !order.ingredientsDeducted) {
      const orderItems = order.items || [];
      const deductions = [];

      for (const item of orderItems) {
        const ingredients = await FoodIngredient.findAll({
          where: { menuItemId: item.id },
          include: [{ model: Stock, as: "stockItem" }],
        });

        for (const ing of ingredients) {
          const stock = ing.stockItem;
          if (stock) {
            const rawNeeded = item.qty * ing.quantity;
            const convertedNeeded = convertQuantity(rawNeeded, ing.unit, stock.unit);
            deductions.push({
              stock,
              needed: Math.round(convertedNeeded * 10000) / 10000,
              dishName: item.name,
              dishQty: item.qty,
            });
          }
        }
      }

      if (deductions.length > 0) {
        const stockTotals = {};
        for (const d of deductions) {
          if (!stockTotals[d.stock.id]) {
            stockTotals[d.stock.id] = { stock: d.stock, totalNeeded: 0, items: [] };
          }
          stockTotals[d.stock.id].totalNeeded += d.needed;
          stockTotals[d.stock.id].items.push(`${d.dishQty}× ${d.dishName}`);
        }

        for (const id in stockTotals) {
          const entry = stockTotals[id];
          if (entry.stock.quantity < entry.totalNeeded) {
            return res.status(400).json({
              error: `Insufficient stock for raw material "${entry.stock.stockName}". Required: ${entry.totalNeeded} ${entry.stock.unit}, Available: ${entry.stock.quantity} ${entry.stock.unit}.`,
            });
          }
        }

        for (const id in stockTotals) {
          const entry = stockTotals[id];
          const prev = entry.stock.quantity;
          const updatedQty = Math.round(Math.max(0, prev - entry.totalNeeded) * 1000) / 1000;

          entry.stock.quantity = updatedQty;
          await entry.stock.save();

          await StockTransaction.create({
            stockId: entry.stock.id,
            stockName: entry.stock.stockName,
            type: "FOOD_PREPARATION",
            quantity: -entry.totalNeeded,
            unit: entry.stock.unit,
            previousStock: prev,
            newStock: updatedQty,
            reason: `Food preparation: ${entry.items.join(", ")} for order ${order.id}`,
            supplierName: entry.stock.supplierName,
            purchasePrice: entry.stock.purchasePrice,
            performedBy: req.user?.name || "Admin",
            orderId: order.id,
            date: new Date(),
          });

          await emitStockNotificationIfNeeded(entry.stock, io);
        }
      }

      order.ingredientsDeducted = true;
    }

    const update = { status: newStatus, ingredientsDeducted: order.ingredientsDeducted };
    if (newStatus === 3) {
      update.completedTime = new Date();
      update.qrUsed = true;
      update.pickedUpAt = new Date();
      update.pickedUpByStaffId = req.user?.id || "admin";
      update.pickedUpByStaffName = req.user?.name || "Canteen Staff";
    }
    await order.update(update);

    if (io) {
      io.to(order.userId).emit("order:status", { orderId: order.id, status: order.status, userId: order.userId });

      if (order.status === 2) {
        const notif = await Notification.create({
          id: `notif-ready-${order.id}-${Date.now()}`,
          userId: order.userId,
          text: `🍽️ Your order is ready for pickup — Token ${order.token} at Counter ${order.counter} (${order.canteenName || "Canteen"})`,
          read: false,
        });
        io.to(order.userId).emit("notification:new", { notification: notif.toJSON() });
      }
    }
    return res.json(order);
  } catch (err) {
    console.error("advanceOrder error:", err);
    return res.status(500).json({ error: err.message || "Failed to advance order." });
  }
};

/* ── PATCH /api/orders/:id/cancel ─────────────────────────────────── */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (req.user.role !== "admin" && order.userId !== req.user.id)
      return res.status(403).json({ error: "Not authorised to cancel this order." });
    if (order.status >= 3)  return res.status(400).json({ error: "Cannot cancel a completed order." });
    if (order.status === -1) return res.status(400).json({ error: "Order is already cancelled." });

    await order.update({ status: -1 });
    return res.json(order);
  } catch (err) {
    console.error("cancelOrder error:", err);
    return res.status(500).json({ error: "Failed to cancel order." });
  }
};
