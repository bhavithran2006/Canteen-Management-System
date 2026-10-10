const jwt = require("jsonwebtoken");

/**
 * Verifies the Bearer token from the Authorization header or x-user headers.
 * On success, attaches req.user = { id, name, email, role, dept, year, walletBalance }
 */
module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, name, email, role, ... }
      return next();
    } catch (err) {
      // Continue to check x-user headers fallback
    }
  }

  // Developer / frontend seamless session fallback
  if (req.headers["x-user-id"]) {
    req.user = {
      id: req.headers["x-user-id"],
      name: req.headers["x-user-name"] || "User",
      email: req.headers["x-user-email"] || "user@canteen.edu",
      role: req.headers["x-user-role"] || "customer",
      dept: req.headers["x-user-dept"] || "CSE",
      year: 1,
    };
    return next();
  }

  return res.status(401).json({ error: "No token provided. Please log in." });
};
