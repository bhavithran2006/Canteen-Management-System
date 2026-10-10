/**
 * Must be used AFTER verifyToken.
 * Rejects requests from non-admin users.
 */
module.exports = function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Admin access required." });
};
