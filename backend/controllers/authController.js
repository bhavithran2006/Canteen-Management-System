const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { OAuth2Client } = require("google-auth-library");
const { User, PasswordResetOtp } = require("../models");
const { sendPasswordResetOtpEmail } = require("../services/emailService");

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      dept: user.dept,
      year: user.year,
      walletBalance: user.walletBalance,
      googleId: user.googleId || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── POST /api/auth/register ───────────────────────────────────────── */
exports.register = async (req, res) => {
  try {
    const { id, name, email, password, dept, year, role } = req.body;

    if (!id || !name || !email || !password)
      return res.status(400).json({ error: "id, name, email and password are required." });

    if (!isValidEmail(email))
      return res.status(400).json({ error: "Please provide a valid email address." });

    // Duplicate ID check
    const idExists = await User.unscoped().findOne({ where: { id: id.trim() } });
    if (idExists)
      return res.status(409).json({ error: `Roll / Staff ID "${id}" is already registered. Please log in.` });

    // Duplicate email check
    const emailExists = await User.unscoped().findOne({ where: { email: email.trim().toLowerCase() } });
    if (emailExists)
      return res.status(409).json({ error: `Email "${email}" is already registered. Please log in.` });

    if (password.length < 3)
      return res.status(400).json({ error: "Password must be at least 3 characters." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      id: id.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role: role === "admin" ? "admin" : "customer",
      dept: dept || "CSE",
      year: Number(year) || 1,
      walletBalance: 340,
    });

    // Re-fetch without password for the response
    const safe = await User.findOne({ where: { id: user.id } });
    return res.status(201).json({ token: signToken(user), user: safe });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Server error during registration." });
  }
};

/* ── POST /api/auth/login ──────────────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { identifier, email, id, password } = req.body;
    const lookup = (identifier || email || id || "").trim();

    if (!lookup || !password)
      return res.status(400).json({ error: "Email / Roll number and password are required." });

    // Fetch WITH password (unscoped bypasses the defaultScope exclude)
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: [
          { email: lookup.toLowerCase() },
          { id: lookup },
        ],
      },
    });

    if (!user)
      return res.status(401).json({ error: "No account found with that email or roll number. Please register first." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Incorrect password. Please try again." });

    const safe = await User.findOne({ where: { id: user.id } });
    return res.json({ token: signToken(user), user: safe });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Server error during login." });
  }
};

/* ── GET /api/auth/check-email ─────────────────────────────────────── */
exports.checkEmail = async (req, res) => {
  try {
    const email = (req.query.email || "").trim().toLowerCase();
    if (!email || !isValidEmail(email))
      return res.status(400).json({ error: "A valid email query param is required." });
    const user = await User.findOne({ where: { email } });
    return res.json({ exists: !!user });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

/* ── GET /api/auth/me ──────────────────────────────────────────────── */
exports.me = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

/* ── Helper: generate cryptographically secure 6-digit OTP ─────────── */
function generate6DigitOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

/* ── POST /api/auth/forgot-password ────────────────────────────────── */
exports.forgotPassword = async (req, res) => {
  try {
    const rawEmail = (req.body.email || "").trim();
    if (!rawEmail || !isValidEmail(rawEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const email = rawEmail.toLowerCase();
    const genericResponse = {
      success: true,
      message: "If an account exists with this email, a verification code has been sent.",
    };

    // Lookup user in database
    const user = await User.findOne({ where: { email } });

    // For security: return identical generic message if user not found (prevent enumeration)
    if (!user) {
      return res.json(genericResponse);
    }

    // Invalidate prior unused OTPs for this email to prevent reuse
    await PasswordResetOtp.update(
      { used: true },
      { where: { email, used: false } }
    );

    // Generate cryptographically secure 6-digit OTP
    const otp = generate6DigitOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store secure hash & expiry in database
    await PasswordResetOtp.create({
      userId: user.id,
      email,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      verified: false,
      used: false,
    });

    // Send verification code to user's registered email (never expose or log OTP)
    await sendPasswordResetOtpEmail(email, otp, 5);

    return res.json(genericResponse);
  } catch (err) {
    console.error("[auth] forgot-password error:", err.message);
    if (err.code === "SMTP_NOT_CONFIGURED") {
      return res.status(503).json({
        error: "Email service is not configured. Please set MAIL_USERNAME and MAIL_PASSWORD in backend/.env.",
      });
    }
    return res.status(500).json({
      error: "Failed to send verification email. Please check your SMTP settings or try again later.",
    });
  }
};

/* ── POST /api/auth/verify-otp & /api/auth/verify-reset-otp ─────────── */
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email: rawEmail, otp: rawOtp } = req.body;
    const email = (rawEmail || "").trim().toLowerCase();
    const otp = (rawOtp || "").toString().trim();

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: "Please enter a valid 6-digit verification code." });
    }

    // Fetch latest active OTP record for this email
    const record = await PasswordResetOtp.findOne({
      where: { email, used: false },
      order: [["createdAt", "DESC"]],
    });

    if (!record) {
      return res.status(400).json({ error: "Invalid verification code or no active request found. Please request a new code." });
    }

    // Check if expired (5 minutes)
    if (new Date() > new Date(record.expiresAt)) {
      return res.status(400).json({ error: "Verification code expired. Please request a new code." });
    }

    // Check max attempts
    if (record.attempts >= record.maxAttempts) {
      return res.status(429).json({
        error: "Too many incorrect attempts. This code is locked. Please request a new code.",
      });
    }

    // Check if already verified
    if (record.verified) {
      const resetToken = jwt.sign(
        { resetId: record.id, email: record.email, purpose: "password-reset" },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );
      return res.json({
        success: true,
        message: "Verification code already verified.",
        resetToken,
      });
    }

    // Compare submitted OTP with stored bcrypt hash
    const match = await bcrypt.compare(otp, record.otpHash);
    if (!match) {
      record.attempts += 1;
      await record.save();
      const remaining = record.maxAttempts - record.attempts;
      if (remaining <= 0) {
        return res.status(429).json({
          error: "Too many incorrect attempts. This code is locked. Please request a new code.",
        });
      }
      return res.status(400).json({
        error: `Invalid verification code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`,
        remainingAttempts: remaining,
      });
    }

    // Successful OTP verification
    record.verified = true;
    const resetToken = jwt.sign(
      { resetId: record.id, email: record.email, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    const tokenHash = await bcrypt.hash(resetToken.slice(-16), 8);
    record.resetTokenHash = tokenHash;
    await record.save();

    return res.json({
      success: true,
      message: "Verification code verified successfully.",
      resetToken,
    });
  } catch (err) {
    console.error("[auth] verify-otp error:", err.message);
    return res.status(500).json({ error: "Verification failed due to a server error." });
  }
};

/* ── POST /api/auth/reset-password ─────────────────────────────────── */
exports.resetPassword = async (req, res) => {
  try {
    const { email: rawEmail, resetToken, newPassword, confirmPassword } = req.body;
    const email = (rawEmail || "").trim().toLowerCase();

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ error: "Email, reset token, and new password are required." });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Validate password requirements:
    // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+\\[\]~`]/.test(newPassword);

    if (newPassword.length < 8 || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Verify JWT reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Reset session has expired or is invalid. Please start again." });
    }

    if (decoded.purpose !== "password-reset" || decoded.email !== email) {
      return res.status(401).json({ error: "Invalid reset token." });
    }

    // Verify the record in database
    const record = await PasswordResetOtp.findByPk(decoded.resetId);
    if (!record || !record.verified || record.used || new Date() > new Date(record.expiresAt)) {
      return res.status(400).json({ error: "Reset session is no longer valid or has already been used." });
    }

    // Find the user in database
    const user = await User.unscoped().findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    // Hash new password using the project's exact bcrypt hashing standard
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Mark OTP record as used so it cannot be reused
    record.used = true;
    await record.save();

    // Invalidate all remaining OTP records for this email
    await PasswordResetOtp.update({ used: true }, { where: { email } });

    console.log(`[auth] Password successfully reset for user: ${email}`);
    return res.json({
      success: true,
      message: "Your password has been updated successfully.",
    });
  } catch (err) {
    console.error("[auth] reset-password error:", err.message);
    return res.status(500).json({ error: "Server error during password reset." });
  }
};

/* ── POST /api/auth/resend-otp ─────────────────────────────────────── */
exports.resendOtp = async (req, res) => {
  try {
    const rawEmail = (req.body.email || "").trim();
    if (!rawEmail || !isValidEmail(rawEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const email = rawEmail.toLowerCase();
    const genericResponse = {
      success: true,
      message: "If an account exists with this email, a new verification code has been sent.",
    };

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json(genericResponse);
    }

    // Invalidate prior OTPs
    await PasswordResetOtp.update(
      { used: true },
      { where: { email, used: false } }
    );

    const otp = generate6DigitOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await PasswordResetOtp.create({
      userId: user.id,
      email,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      verified: false,
      used: false,
    });

    await sendPasswordResetOtpEmail(email, otp, 5);

    return res.json(genericResponse);
  } catch (err) {
    console.error("[auth] resend-otp error:", err.message);
    if (err.code === "SMTP_NOT_CONFIGURED") {
      return res.status(503).json({
        error: "Email service is not configured. Please set MAIL_USERNAME and MAIL_PASSWORD in backend/.env.",
      });
    }
    return res.status(500).json({ error: "Unable to resend verification code at this time." });
  }
};

/* ── POST /api/auth/google ─────────────────────────────────────────── */
exports.googleAuth = async (req, res) => {
  try {
    const rawToken = req.body.idToken || req.body.credential || req.body.token;
    const idToken = (rawToken || "").toString().trim();
    const { linkPassword } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required." });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("[auth] GOOGLE_CLIENT_ID is not configured in backend environment.");
      return res.status(500).json({
        error: "Google Sign-In is not configured on the server. Please check backend settings.",
      });
    }

    const googleClient = new OAuth2Client(clientId);
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.error("[auth] Google verifyIdToken error:", verifyErr.message);
      return res.status(401).json({
        error: "Invalid, expired, or unverified Google token. Please sign in again.",
      });
    }

    if (!payload || !payload.sub || !payload.email) {
      return res.status(401).json({ error: "Incomplete identity payload received from Google." });
    }

    // Require verified email status from Google identity
    if (!payload.email_verified) {
      return res.status(403).json({
        error: "Your Google email address is unverified. Please verify your email with Google first.",
      });
    }

    const googleSub = String(payload.sub).trim();
    const verifiedEmail = String(payload.email).toLowerCase().trim();
    const verifiedName = (payload.name && payload.name.trim()) || verifiedEmail.split("@")[0];

    // 1. Check if an account is already linked with this stable Google ID
    const userByGoogleId = await User.unscoped().findOne({
      where: { googleId: googleSub },
    });

    if (userByGoogleId) {
      const safe = await User.findOne({ where: { id: userByGoogleId.id } });
      return res.json({
        token: signToken(userByGoogleId),
        user: safe,
        message: "Logged in successfully with Google.",
      });
    }

    // 2. Check if an account already exists with this email
    const userByEmail = await User.unscoped().findOne({
      where: { email: verifiedEmail },
    });

    if (userByEmail) {
      // Prevent duplicate or conflicting Google identity links
      if (userByEmail.googleId && userByEmail.googleId !== googleSub) {
        return res.status(409).json({
          error: "This email is already linked to a different Google account.",
        });
      }

      // Existing account has NO Google identity linked yet:
      // DO NOT automatically link accounts based on email alone. Require password verification.
      if (!linkPassword) {
        return res.status(409).json({
          error: "An account with this email already exists. Please verify your existing password to link Google.",
          code: "ACCOUNT_EXISTS_NEEDS_LINKING",
          email: verifiedEmail,
          requiresPasswordLink: true,
        });
      }

      // Verify the password for the existing account
      const passwordMatches = await bcrypt.compare(linkPassword, userByEmail.password);
      if (!passwordMatches) {
        return res.status(401).json({
          error: "Incorrect password for existing account. Account linking cancelled.",
          code: "INVALID_LINK_PASSWORD",
          requiresPasswordLink: true,
        });
      }

      // Securely link Google identity to existing account
      userByEmail.googleId = googleSub;
      await userByEmail.save();

      const safe = await User.findOne({ where: { id: userByEmail.id } });
      return res.json({
        token: signToken(userByEmail),
        user: safe,
        message: "Google account successfully linked and authenticated.",
      });
    }

    // 3. New Google User Registration
    // Derive unique primary key ID (roll/user identifier)
    let candidateId = verifiedEmail.split("@")[0].toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!candidateId || candidateId.length < 3) {
      candidateId = `G-${googleSub.slice(-8)}`;
    }

    // Ensure candidateId is unique
    const idTaken = await User.unscoped().findOne({ where: { id: candidateId } });
    if (idTaken) {
      candidateId = `${candidateId}-${crypto.randomInt(100, 999)}`;
    }

    // Generate secure random password hash for SQLite schema compatibility
    const randomSecret = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomSecret, 10);

    // Create new customer account (roles: NEVER grant admin via Google registration)
    const newUser = await User.create({
      id: candidateId,
      name: verifiedName,
      email: verifiedEmail,
      password: hashedPassword,
      googleId: googleSub,
      role: "customer",
      dept: "CSE",
      year: 1,
      walletBalance: 340,
    });

    const safe = await User.findOne({ where: { id: newUser.id } });
    return res.status(201).json({
      token: signToken(newUser),
      user: safe,
      message: "Registered and logged in with Google successfully.",
    });
  } catch (err) {
    console.error("[auth] googleAuth error:", err.message);
    return res.status(500).json({
      error: "Google authentication failed due to a server error. Please try again later.",
    });
  }
};

/* ── POST /api/auth/link-google ─────────────────────────────────────── */
exports.linkGoogleAccount = async (req, res) => {
  try {
    const rawToken = req.body.idToken || req.body.credential || req.body.token;
    const idToken = (rawToken || "").toString().trim();

    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required." });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({
        error: "Google Sign-In is not configured on the server.",
      });
    }

    const googleClient = new OAuth2Client(clientId);
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired Google token." });
    }

    if (!payload || !payload.sub || !payload.email_verified) {
      return res.status(400).json({ error: "Incomplete or unverified identity payload from Google." });
    }

    const googleSub = String(payload.sub).trim();

    // Prevent linking if another account already has this googleId
    const inUse = await User.unscoped().findOne({
      where: {
        googleId: googleSub,
        id: { [Op.ne]: req.user.id },
      },
    });

    if (inUse) {
      return res.status(409).json({ error: "This Google identity is already linked to another account." });
    }

    const user = await User.unscoped().findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    user.googleId = googleSub;
    await user.save();

    const safe = await User.findOne({ where: { id: user.id } });
    return res.json({
      success: true,
      message: "Google account linked successfully.",
      user: safe,
    });
  } catch (err) {
    console.error("[auth] linkGoogleAccount error:", err.message);
    return res.status(500).json({ error: "Failed to link Google account." });
  }
};
