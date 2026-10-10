const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getBalance, topUp, deduct } = require("../controllers/walletController");

router.get("/", auth, getBalance);
router.post("/topup", auth, topUp);
router.post("/deduct", auth, deduct);

module.exports = router;
