const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for OTP request / resend endpoints to prevent abuse and spam.
 * Allows at most 5 requests per 15-minute window per IP.
 */
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many password reset requests from this IP. Please try again after 15 minutes.",
  },
});

/**
 * Rate limiter for OTP verification attempts per IP to prevent brute-forcing.
 * Allows at most 10 verification attempts per 15 minutes per IP.
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many OTP verification attempts. Please try again after 15 minutes.",
  },
});

/**
 * In-memory map to enforce 60-second cooldown between consecutive OTP requests for the same email.
 */
const emailCooldowns = new Map();

function checkEmailCooldown(req, res, next) {
  const email = (req.body.email || "").trim().toLowerCase();
  if (!email) return next();

  const now = Date.now();
  const lastRequested = emailCooldowns.get(email);

  if (lastRequested && now - lastRequested < 30 * 1000) {
    const remainingSeconds = Math.ceil((30 * 1000 - (now - lastRequested)) / 1000);
    return res.status(429).json({
      error: `Please wait ${remainingSeconds} seconds before requesting another verification code.`,
      cooldownRemaining: remainingSeconds,
    });
  }

  // Record this attempt time
  emailCooldowns.set(email, now);

  // Auto clean-up after 2 minutes
  setTimeout(() => {
    if (emailCooldowns.get(email) === now) {
      emailCooldowns.delete(email);
    }
  }, 120 * 1000);

  next();
}

module.exports = {
  otpRequestLimiter,
  otpVerifyLimiter,
  checkEmailCooldown,
};
