const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  otpRequestLimiter,
  otpVerifyLimiter,
  checkEmailCooldown,
} = require("../middleware/rateLimiter");
const {
  register,
  login,
  me,
  checkEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  resendOtp,
  googleAuth,
  linkGoogleAccount,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.get("/check-email", checkEmail); // ?email=you@college.edu → { exists: true|false }

// Google OAuth routes
router.post("/google", googleAuth);
router.post("/link-google", auth, linkGoogleAccount);

// Password Reset OTP routes
router.post("/forgot-password", otpRequestLimiter, checkEmailCooldown, forgotPassword);
router.post("/verify-otp", otpVerifyLimiter, verifyResetOtp);
router.post("/verify-reset-otp", otpVerifyLimiter, verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", otpRequestLimiter, checkEmailCooldown, resendOtp);

module.exports = router;
