const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
  placeOrder,
  getActiveOrder,
  getOrderHistory,
  getOrderById,
  confirmPayment,
  getOrderQrPass,
  verifyQrToken,
  confirmQrPickup,
  advanceOrder,
  cancelOrder,
} = require("../controllers/orderController");

// Specific sub-paths BEFORE /:id to avoid route shadowing
router.get("/active", auth, getActiveOrder);
router.get("/history", auth, getOrderHistory);
router.post("/qr-verify", auth, adminOnly, verifyQrToken);
router.post("/qr-confirm", auth, adminOnly, confirmQrPickup);
router.post("/", auth, placeOrder);

// Order-specific routes
router.get("/:id", auth, getOrderById);
router.get("/:id/qr", auth, getOrderQrPass);
router.post("/:id/payment", auth, confirmPayment);
router.patch("/:id/advance", auth, adminOnly, advanceOrder);
router.patch("/:id/cancel", auth, cancelOrder);

module.exports = router;
