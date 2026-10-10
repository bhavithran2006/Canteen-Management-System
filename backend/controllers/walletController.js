const { User } = require("../models");

/* ── GET /api/wallet ───────────────────────────────────────────────── */
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch wallet balance." });
  }
};

/* ── POST /api/wallet/topup ────────────────────────────────────────── */
exports.topUp = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "amount must be a positive number." });

    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found." });

    await user.update({ walletBalance: user.walletBalance + amount });
    return res.json({ walletBalance: user.walletBalance, added: amount });
  } catch (err) {
    return res.status(500).json({ error: "Failed to top up wallet." });
  }
};

/* ── POST /api/wallet/deduct ───────────────────────────────────────── */
exports.deduct = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "amount must be a positive number." });

    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found." });
    if (user.walletBalance < amount)
      return res.status(400).json({
        error: `Insufficient wallet balance. Available: ₹${user.walletBalance}, Required: ₹${amount}.`,
        insufficientBalance: true,
        walletBalance: user.walletBalance,
      });

    await user.update({ walletBalance: user.walletBalance - amount });
    return res.json({ walletBalance: user.walletBalance, deducted: amount });
  } catch (err) {
    return res.status(500).json({ error: "Failed to deduct from wallet." });
  }
};
