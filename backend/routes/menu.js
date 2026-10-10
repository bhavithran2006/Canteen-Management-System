const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
  listMenu,
  addMenuItem,
  updateStock,
  deleteMenuItem,
} = require("../controllers/menuController");

router.get("/", listMenu);
router.post("/", auth, adminOnly, addMenuItem);
router.patch("/:id/stock", auth, adminOnly, updateStock);
router.delete("/:id", auth, adminOnly, deleteMenuItem);

module.exports = router;
