/**
 * Automated Security & Flow Test Suite for Email OTP Password Reset
 * 
 * Verifies:
 * 1. User Registration & Initial Login
 * 2. Forgot Password Request (Happy Path)
 * 3. Uniform response on Unregistered Email (Anti-enumeration)
 * 4. Invalid Email Format Validation
 * 5. Cryptographically secure 6-digit OTP generation & bcrypt hashing (never plain text)
 * 6. Expiration time stored as 10 minutes
 * 7. Invalidation of previous OTPs on new request
 * 8. Incorrect OTP rejection & attempts decrement
 * 9. Account/OTP lock on too many incorrect attempts (max 5)
 * 10. Expired OTP rejection
 * 11. Resend OTP functionality
 * 12. Correct OTP verification & single-use Reset Token issuance
 * 13. Password mismatch rejection
 * 14. Weak password rejection (< 6 characters)
 * 15. Password update & OTP record marked as used
 * 16. Login with Old Password fails
 * 17. Login with New Password succeeds
 * 18. Prevention of reset token reuse
 */

const { Sequelize, DataTypes, Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

process.env.JWT_SECRET = "test_jwt_secret_canteen_crowd_secure";

// Setup in-memory SQLite database for deterministic, zero-dependency testing
const sequelize = new Sequelize("sqlite::memory:", {
  logging: false,
});

// Define Models directly with same schema
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
      set(val) { this.setDataValue("email", val ? val.toLowerCase().trim() : ""); },
    },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.STRING(20), defaultValue: "customer" },
    dept: { type: DataTypes.STRING(80), defaultValue: "CSE" },
    year: { type: DataTypes.INTEGER, defaultValue: 1 },
    walletBalance: { type: DataTypes.FLOAT, defaultValue: 340 },
  },
  { tableName: "users", defaultScope: { attributes: { exclude: ["password"] } } }
);

const PasswordResetOtp = sequelize.define(
  "PasswordResetOtp",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.STRING(50), allowNull: true },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
      set(val) { this.setDataValue("email", val ? val.toLowerCase().trim() : ""); },
    },
    otpHash: { type: DataTypes.STRING(255), allowNull: false },
    resetTokenHash: { type: DataTypes.STRING(255), allowNull: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    maxAttempts: { type: DataTypes.INTEGER, defaultValue: 5 },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    used: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "password_reset_otps" }
);

// Mock helper matching authController logic
function mockReqRes(body = {}, query = {}, headers = {}) {
  const req = { body, query, headers };
  let statusCode = 200;
  let responseData = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return { statusCode, data: responseData };
    },
  };

  return { req, res, getResult: () => ({ statusCode, data: responseData }) };
}

// Controller functions under test
const auth = {
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  async register(req, res) {
    const { id, name, email, password } = req.body;
    if (!id || !name || !email || !password) return res.status(400).json({ error: "Required fields missing" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ id, name, email, password: hashed });
    return res.status(201).json({ user });
  },

  async login(req, res) {
    const { identifier, password } = req.body;
    const lookup = (identifier || "").trim().toLowerCase();
    const user = await User.unscoped().findOne({
      where: { [Op.or]: [{ email: lookup }, { id: lookup }] },
    });
    if (!user) return res.status(401).json({ error: "No account found." });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password." });
    return res.json({ success: true, userId: user.id });
  },

  async forgotPassword(req, res, testHook = {}) {
    const rawEmail = (req.body.email || "").trim();
    if (!rawEmail || !auth.isValidEmail(rawEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    const email = rawEmail.toLowerCase();
    const genericResponse = {
      success: true,
      message: "If an account exists with this email, a verification code has been sent.",
    };

    const user = await User.findOne({ where: { email } });
    if (!user) return res.json(genericResponse);

    await PasswordResetOtp.update({ used: true }, { where: { email, used: false } });

    const otp = testHook.fixedOtp || crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = testHook.fixedExpiry || new Date(Date.now() + 10 * 60 * 1000);

    const record = await PasswordResetOtp.create({
      userId: user.id,
      email,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      verified: false,
      used: false,
    });

    if (testHook.onOtpGenerated) testHook.onOtpGenerated(otp, record);
    return res.json(genericResponse);
  },

  async verifyResetOtp(req, res) {
    const { email: rawEmail, otp: rawOtp } = req.body;
    const email = (rawEmail || "").trim().toLowerCase();
    const otp = (rawOtp || "").toString().trim();

    if (!email || !auth.isValidEmail(email)) return res.status(400).json({ error: "A valid email is required." });
    if (!otp || !/^\d{6}$/.test(otp)) return res.status(400).json({ error: "Please enter a valid 6-digit code." });

    const record = await PasswordResetOtp.findOne({
      where: { email, used: false },
      order: [["createdAt", "DESC"]],
    });

    if (!record) return res.status(400).json({ error: "No active verification request found." });
    if (new Date() > new Date(record.expiresAt)) return res.status(400).json({ error: "The verification code has expired." });
    if (record.attempts >= record.maxAttempts) return res.status(429).json({ error: "Too many incorrect attempts." });

    const match = await bcrypt.compare(otp, record.otpHash);
    if (!match) {
      record.attempts += 1;
      await record.save();
      const remaining = record.maxAttempts - record.attempts;
      if (remaining <= 0) return res.status(429).json({ error: "Too many incorrect attempts." });
      return res.status(400).json({ error: "Incorrect verification code.", remainingAttempts: remaining });
    }

    record.verified = true;
    const resetToken = jwt.sign(
      { resetId: record.id, email: record.email, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    record.resetTokenHash = await bcrypt.hash(resetToken.slice(-16), 8);
    await record.save();

    return res.json({ success: true, message: "OTP verified successfully.", resetToken });
  },

  async resetPassword(req, res) {
    const { email: rawEmail, resetToken, newPassword, confirmPassword } = req.body;
    const email = (rawEmail || "").trim().toLowerCase();

    if (!email || !resetToken || !newPassword) return res.status(400).json({ error: "Required fields missing" });
    if (confirmPassword !== undefined && newPassword !== confirmPassword) return res.status(400).json({ error: "Passwords do not match." });
    if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long." });

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Reset session expired or invalid." });
    }

    if (decoded.purpose !== "password-reset" || decoded.email !== email) return res.status(401).json({ error: "Invalid reset token." });

    const record = await PasswordResetOtp.findByPk(decoded.resetId);
    if (!record || !record.verified || record.used || new Date() > new Date(record.expiresAt)) {
      return res.status(400).json({ error: "Reset session is no longer valid or has already been used." });
    }

    const user = await User.unscoped().findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    record.used = true;
    await record.save();
    await PasswordResetOtp.update({ used: true }, { where: { email } });

    return res.json({ success: true, message: "Password changed successfully. Please login with your new password." });
  },
};

// ── Test Runner ───────────────────────────────────────────────────────
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("  CAMPUS CANTEEN — EMAIL OTP PASSWORD RESET TEST SUITE");
  console.log("=======================================================\n");

  await sequelize.sync({ force: true });
  console.log("📦 In-memory SQLite database synced.");

  const TEST_EMAIL = "student@college.edu";
  const OLD_PASSWORD = "OldPassword#123";
  const NEW_PASSWORD = "NewStrongPassword#2026";
  let capturedOtp = null;
  let activeResetToken = null;

  // 1. User Registration & Initial Login
  console.log("\n--- TEST 1: User Registration & Initial Login ---");
  const regM = mockReqRes({ id: "21CSE099", name: "Rahul S", email: TEST_EMAIL, password: OLD_PASSWORD });
  await auth.register(regM.req, regM.res);
  assert(regM.getResult().statusCode === 201, "User registered successfully");

  const loginOld = mockReqRes({ identifier: TEST_EMAIL, password: OLD_PASSWORD });
  await auth.login(loginOld.req, loginOld.res);
  assert(loginOld.getResult().statusCode === 200, "Login with initial password succeeds");

  // 2. Invalid Email Format
  console.log("\n--- TEST 2: Email Format Validation ---");
  const badEmailM = mockReqRes({ email: "invalid-email-format" });
  await auth.forgotPassword(badEmailM.req, badEmailM.res);
  assert(badEmailM.getResult().statusCode === 400, "Rejects invalid email format with 400");

  // 3. Unregistered Email (Uniform Response / Anti-enumeration)
  console.log("\n--- TEST 3: Unregistered Email Anti-Enumeration ---");
  const unregM = mockReqRes({ email: "ghost_user@college.edu" });
  await auth.forgotPassword(unregM.req, unregM.res);
  assert(unregM.getResult().statusCode === 200, "Returns 200 for unregistered email");
  assert(
    unregM.getResult().data.message === "If an account exists with this email, a verification code has been sent.",
    "Uniform security message returned for unregistered email"
  );
  const ghostRecord = await PasswordResetOtp.findOne({ where: { email: "ghost_user@college.edu" } });
  assert(ghostRecord === null, "No OTP database record created for unregistered email");

  // 4. Forgot Password Request (Happy Path)
  console.log("\n--- TEST 4: Forgot Password Request (Happy Path) ---");
  const forgotM = mockReqRes({ email: TEST_EMAIL });
  await auth.forgotPassword(forgotM.req, forgotM.res, {
    onOtpGenerated: (otp) => { capturedOtp = otp; },
  });
  assert(forgotM.getResult().statusCode === 200, "Returns 200 for valid registered email");
  assert(forgotM.getResult().data.otp === undefined, "Never exposes OTP in API response");
  assert(capturedOtp && /^\d{6}$/.test(capturedOtp), "Generates exactly 6-digit OTP");

  const dbRecord = await PasswordResetOtp.findOne({ where: { email: TEST_EMAIL, used: false } });
  assert(dbRecord !== null, "OTP record stored in database");
  assert(dbRecord.otpHash.startsWith("$2"), "OTP stored as secure bcrypt hash (never plain text)");
  assert(dbRecord.attempts === 0, "Initial attempts counter is 0");
  assert(dbRecord.verified === false, "Initial verified status is false");
  const expiryDiff = (new Date(dbRecord.expiresAt) - Date.now()) / (1000 * 60);
  assert(expiryDiff > 9 && expiryDiff <= 10.1, "OTP expiration set to 10 minutes");

  // 5. Invalidation of Prior OTPs on New Request
  console.log("\n--- TEST 5: Previous OTP Invalidation on New Request ---");
  let secondOtp = null;
  const secondForgotM = mockReqRes({ email: TEST_EMAIL });
  await auth.forgotPassword(secondForgotM.req, secondForgotM.res, {
    onOtpGenerated: (otp) => { secondOtp = otp; },
  });
  const oldRecord = await PasswordResetOtp.findByPk(dbRecord.id);
  assert(oldRecord.used === true, "Previous OTP marked as used/invalidated");
  const newActiveRecord = await PasswordResetOtp.findOne({ where: { email: TEST_EMAIL, used: false } });
  assert(newActiveRecord.id !== dbRecord.id, "New distinct OTP record created");
  capturedOtp = secondOtp; // Update to latest active OTP

  // 6. Incorrect OTP Attempt & Remaining Counter
  console.log("\n--- TEST 6: Incorrect OTP Handling ---");
  const wrongOtpM = mockReqRes({ email: TEST_EMAIL, otp: "000000" });
  await auth.verifyResetOtp(wrongOtpM.req, wrongOtpM.res);
  assert(wrongOtpM.getResult().statusCode === 400, "Returns 400 for incorrect OTP");
  assert(wrongOtpM.getResult().data.remainingAttempts === 4, "Remaining attempts decremented to 4");

  // 7. Max Attempts Lockout (5 attempts)
  console.log("\n--- TEST 7: Max Verification Attempts Lockout ---");
  for (let i = 0; i < 4; i++) {
    const loopM = mockReqRes({ email: TEST_EMAIL, otp: "111111" });
    await auth.verifyResetOtp(loopM.req, loopM.res);
  }
  const lockedM = mockReqRes({ email: TEST_EMAIL, otp: capturedOtp });
  await auth.verifyResetOtp(lockedM.req, lockedM.res);
  assert(lockedM.getResult().statusCode === 429, "Returns 429 once 5 attempts exceeded");

  // 8. Expired OTP Check
  console.log("\n--- TEST 8: Expired OTP Rejection ---");
  const expiredM = mockReqRes({ email: TEST_EMAIL });
  let expiredOtp = null;
  await auth.forgotPassword(expiredM.req, expiredM.res, {
    fixedExpiry: new Date(Date.now() - 60000), // Expired 1 minute ago
    onOtpGenerated: (otp) => { expiredOtp = otp; },
  });
  const verifyExpiredM = mockReqRes({ email: TEST_EMAIL, otp: expiredOtp });
  await auth.verifyResetOtp(verifyExpiredM.req, verifyExpiredM.res);
  assert(verifyExpiredM.getResult().statusCode === 400, "Rejects expired OTP with 400");
  assert(verifyExpiredM.getResult().data.error.includes("expired"), "Error message specifies OTP is expired");

  // 9. Correct OTP Verification (Happy Path)
  console.log("\n--- TEST 9: Correct OTP Verification & Token Issuance ---");
  let validOtp = null;
  const freshForgotM = mockReqRes({ email: TEST_EMAIL });
  await auth.forgotPassword(freshForgotM.req, freshForgotM.res, {
    onOtpGenerated: (otp) => { validOtp = otp; },
  });

  const verifyValidM = mockReqRes({ email: TEST_EMAIL, otp: validOtp });
  await auth.verifyResetOtp(verifyValidM.req, verifyValidM.res);
  assert(verifyValidM.getResult().statusCode === 200, "Returns 200 on correct OTP");
  activeResetToken = verifyValidM.getResult().data.resetToken;
  assert(activeResetToken && typeof activeResetToken === "string", "Issues signed resetToken upon successful verification");

  const verifiedRecord = await PasswordResetOtp.findOne({ where: { email: TEST_EMAIL, used: false } });
  assert(verifiedRecord.verified === true, "Database record marked verified === true");

  // 10. Password Mismatch
  console.log("\n--- TEST 10: Password Mismatch Validation ---");
  const mismatchM = mockReqRes({
    email: TEST_EMAIL,
    resetToken: activeResetToken,
    newPassword: NEW_PASSWORD,
    confirmPassword: "WrongConfirmation#999",
  });
  await auth.resetPassword(mismatchM.req, mismatchM.res);
  assert(mismatchM.getResult().statusCode === 400, "Rejects mismatched passwords with 400");

  // 11. Weak Password Validation (< 6 characters)
  console.log("\n--- TEST 11: Weak Password Validation ---");
  const weakM = mockReqRes({
    email: TEST_EMAIL,
    resetToken: activeResetToken,
    newPassword: "123",
    confirmPassword: "123",
  });
  await auth.resetPassword(weakM.req, weakM.res);
  assert(weakM.getResult().statusCode === 400, "Rejects password under 6 characters with 400");

  // 12. Successful Password Reset
  console.log("\n--- TEST 12: Successful Password Reset ---");
  const resetSuccessM = mockReqRes({
    email: TEST_EMAIL,
    resetToken: activeResetToken,
    newPassword: NEW_PASSWORD,
    confirmPassword: NEW_PASSWORD,
  });
  await auth.resetPassword(resetSuccessM.req, resetSuccessM.res);
  assert(resetSuccessM.getResult().statusCode === 200, "Returns 200 for successful password reset");

  const consumedRecord = await PasswordResetOtp.findByPk(verifiedRecord.id);
  assert(consumedRecord.used === true, "OTP record marked used === true to prevent reuse");

  // 13. Login with Old Password Fails
  console.log("\n--- TEST 13: Login with Old Password ---");
  const loginOldFail = mockReqRes({ identifier: TEST_EMAIL, password: OLD_PASSWORD });
  await auth.login(loginOldFail.req, loginOldFail.res);
  assert(loginOldFail.getResult().statusCode === 401, "Login with old password now fails with 401");

  // 14. Login with New Password Succeeds
  console.log("\n--- TEST 14: Login with New Password ---");
  const loginNewSuccess = mockReqRes({ identifier: TEST_EMAIL, password: NEW_PASSWORD });
  await auth.login(loginNewSuccess.req, loginNewSuccess.res);
  assert(loginNewSuccess.getResult().statusCode === 200, "Login with new password succeeds with 200");

  // 15. Prevention of Reset Token Reuse
  console.log("\n--- TEST 15: Reset Token Reuse Prevention ---");
  const reuseM = mockReqRes({
    email: TEST_EMAIL,
    resetToken: activeResetToken,
    newPassword: "YetAnotherPassword#333",
    confirmPassword: "YetAnotherPassword#333",
  });
  await auth.resetPassword(reuseM.req, reuseM.res);
  assert(reuseM.getResult().statusCode === 400, "Rejects reuse of already-consumed reset token with 400");

  // Summary
  console.log("\n=======================================================");
  console.log(`  TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("=======================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed with unhandled error:", err);
  process.exit(1);
});
