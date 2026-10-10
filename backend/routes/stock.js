const express = require("express");
const router = express.Router();
const recipeRouter = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
  listStock,
  getStockAlerts,
  getAllStockHistory,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  addStockQuantity,
  reduceStockQuantity,
  getStockItemHistory,
} = require("../controllers/stockController");

const {
  getRecipeIngredients,
  saveRecipeIngredient,
  deleteRecipeIngredient,
} = require("../controllers/recipeController");

// ── Stock Management Endpoints ────────────────────────────────────────
router.get("/", auth, adminOnly, listStock);
router.get("/alerts", auth, adminOnly, getStockAlerts);
router.get("/history", auth, adminOnly, getAllStockHistory);
router.get("/:id/history", auth, adminOnly, getStockItemHistory);
router.get("/:id", auth, adminOnly, getStockById);
router.post("/", auth, adminOnly, createStock);
router.put("/:id", auth, adminOnly, updateStock);
router.delete("/:id", auth, adminOnly, deleteStock);
router.post("/:id/add", auth, adminOnly, addStockQuantity);
router.post("/:id/reduce", auth, adminOnly, reduceStockQuantity);

// ── Food Ingredient Mapping Endpoints ─────────────────────────────────
recipeRouter.get("/", auth, adminOnly, getRecipeIngredients);
recipeRouter.get("/:menuItemId", auth, adminOnly, getRecipeIngredients);
recipeRouter.post("/", auth, adminOnly, saveRecipeIngredient);
recipeRouter.delete("/:id", auth, adminOnly, deleteRecipeIngredient);

module.exports = router;
module.exports.recipeRouter = recipeRouter;
