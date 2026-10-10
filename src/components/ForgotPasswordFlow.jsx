import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Inline SVG Icons matching App.jsx ────────────────────────────── */
const ic = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

const MailIcon = ({ size = 18 }) => (
  <svg {...ic(size)}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = ({ size = 18 }) => (
  <svg {...ic(size)}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ size = 18 }) => (
  <svg {...ic(size)}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 18 }) => (
  <svg {...ic(size)}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ArrowLeftIcon = ({ size = 18 }) => (
  <svg {...ic(size)}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const CheckIcon = ({ size = 16 }) => (
  <svg {...ic(size)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShieldCheckIcon = ({ size = 20 }) => (
  <svg {...ic(size)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ClockIcon = ({ size = 16 }) => (
  <svg {...ic(size)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const API_BASE = "const API_URL = import.meta.env.VITE_API_URL;";

export default function ForgotPasswordFlow({
  onNavigate,
  initialRoute = "forgot-password",
  lang = "en",
  toggleLang,
  showAlert,
  onPasswordResetSuccess,
  registeredUsers = [],
}) {
  // Step: 1 = Enter Email (/forgot-password), 2 = Enter OTP (/verify-otp), 3 = Reset Password (/reset-password), 4 = Success
  const [step, setStep] = useState(() => {
    if (initialRoute === "verify-otp") return 2;
    if (initialRoute === "reset-password") return 3;
    return 1;
  });

  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(null);

  // Timers: 5-minute expiry (300s) & 30-second resend cooldown
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Refs for 6-box OTP inputs
  const inputRefs = useRef([]);
  const popupTimerRef = useRef(null);

  const showError = useCallback((msg) => {
    setErrorMsg(msg);
    clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => setErrorMsg(""), 5000);
  }, []);

  // Update URL hash when step changes to maintain clean navigation
  const transitionToStep = useCallback(
    (nextStep, routeName) => {
      setStep(nextStep);
      setErrorMsg("");
      if (onNavigate && routeName) {
        onNavigate(routeName);
      }
    },
    [onNavigate]
  );

  // 5-Minute OTP Expiry Countdown (300 seconds)
  useEffect(() => {
    if (step !== 2) return;
    const timer = setInterval(() => {
      setOtpSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Resend Cooldown Countdown (30 seconds)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Password rules validation
  const ruleMinLength = newPassword.length >= 8;
  const ruleUppercase = /[A-Z]/.test(newPassword);
  const ruleLowercase = /[a-z]/.test(newPassword);
  const ruleNumber = /[0-9]/.test(newPassword);
  const ruleSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+\\[\]~`]/.test(newPassword);
  const ruleMatch = Boolean(confirmPassword && newPassword === confirmPassword);
  const allRulesPassed =
    ruleMinLength && ruleUppercase && ruleLowercase && ruleNumber && ruleSpecial && ruleMatch;

  /* ────────────────────────────────────────────────────────────────── */
  /* Step 1: Send Verification Code                                     */
  /* ────────────────────────────────────────────────────────────────── */
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      showError(
        lang === "ta" ? "மின்னஞ்சலை உள்ளிடவும்" : "Email cannot be empty. Please enter your registered email."
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showError(
        lang === "ta" ? "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்" : "Please provide a valid email format."
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to send verification code.");
      }

      setSuccessMsg(
        lang === "ta"
          ? "சரிபார்ப்புக் குறியீடு அனுப்பப்பட்டது. தயவுசெய்து உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்."
          : "A 6-digit verification code has been sent to your registered email address."
      );
      setOtpSecondsLeft(300); // 5 minutes
      setResendCooldown(30); // 30s cooldown
      transitionToStep(2, "verify-otp");
      setTimeout(() => inputRefs.current[0]?.focus(), 250);
    } catch (err) {
      // Check if backend offline or error
      if (err.message && err.message.includes("Failed to fetch")) {
        showError("Backend server is not reachable on http://localhost:5000. Please ensure the backend is running.");
      } else {
        showError(err.message || "Failed to send verification email. Please check SMTP settings.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────────────────────────────────── */
  /* Step 2: Handle OTP input & auto-focus                              */
  /* ────────────────────────────────────────────────────────────────── */
  const handleOtpChange = (index, value) => {
    // If user pastes multi-character code
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      const nextOtp = [...otpDigits];
      cleanDigits.forEach((digit, i) => {
        if (i < 6) nextOtp[i] = digit;
      });
      setOtpDigits(nextOtp);
      const nextFocus = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const singleDigit = value.replace(/\D/g, "");
    const nextOtp = [...otpDigits];
    nextOtp[index] = singleDigit;
    setOtpDigits(nextOtp);

    // Auto-advance to next box
    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanOtp = otpDigits.join("").trim();

    if (cleanOtp.length !== 6) {
      showError(
        lang === "ta"
          ? "6 இலக்கக் குறியீட்டை முழுமையாக உள்ளிடவும்"
          : "Please enter the complete 6-digit verification code."
      );
      return;
    }

    if (otpSecondsLeft <= 0) {
      showError(
        lang === "ta"
          ? "சரிபார்ப்புக் குறியீடு காலாவதியானது. புதிய குறியீட்டைப் பெறவும்."
          : "Verification code expired. Please request a new code."
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: cleanOtp }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        throw new Error(data.error || "Invalid verification code.");
      }

      setResetToken(data.resetToken || "valid_reset_token");
      setSuccessMsg(lang === "ta" ? "சரிபார்ப்பு வெற்றிகரமாக முடிந்தது!" : "Verification code verified successfully!");
      transitionToStep(3, "reset-password");
    } catch (err) {
      showError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────────────────────────────────── */
  /* Step 2: Resend Code                                                */
  /* ────────────────────────────────────────────────────────────────── */
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to resend verification code.");
      }

      setOtpDigits(["", "", "", "", "", ""]);
      setOtpSecondsLeft(300); // Reset to 5 minutes
      setResendCooldown(30); // 30s cooldown
      setRemainingAttempts(null);
      setSuccessMsg(
        lang === "ta"
          ? "புதிய சரிபார்ப்புக் குறியீடு அனுப்பப்பட்டுள்ளது."
          : "A new verification code has been sent to your email."
      );
      inputRefs.current[0]?.focus();
    } catch (err) {
      showError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────────────────────────────────── */
  /* Step 3: Create New Password                                        */
  /* ────────────────────────────────────────────────────────────────── */
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();

    if (!newPassword) {
      showError(lang === "ta" ? "புதிய கடவுச்சொல்லை உள்ளிடவும்" : "Please enter your new password.");
      return;
    }

    if (!allRulesPassed) {
      if (newPassword !== confirmPassword) {
        showError(lang === "ta" ? "கடவுச்சொற்கள் பொருந்தவில்லை" : "Passwords do not match.");
      } else {
        showError(
          lang === "ta"
            ? "கடவுச்சொல் தேவைகளைப் பூர்த்தி செய்யவும்"
            : "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
        );
      }
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          resetToken,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Password reset failed.");
      }

      // Sync updated password with frontend localStorage mock data if present
      if (onPasswordResetSuccess) {
        onPasswordResetSuccess(cleanEmail, newPassword);
      }

      if (showAlert) {
        showAlert(
          lang === "ta"
            ? "✅ கடவுச்சொல் மாற்றப்பட்டது! புதிய கடவுச்சொல்லுடன் உள்நுழையவும்."
            : "✅ Password updated successfully! Please login with your new password."
        );
      }

      setStep(4); // Success step
    } catch (err) {
      showError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ref-login-canvas">
      {/* Background Video matching Canteen Theme */}
      <video autoPlay loop muted playsInline className="ref-login-bg-video">
        <source src="/login-bg.mp4" type="video/mp4" />
        <source src="/270557_medium.mp4" type="video/mp4" />
      </video>
      <div className="ref-login-video-overlay" />

      {/* Error Toast Notification Popup */}
      {errorMsg && (
        <div className="login-popup-error" role="alert">
          <span className="login-popup-icon">⚠️</span>
          <span className="login-popup-msg">{errorMsg}</span>
          <button
            className="login-popup-close"
            type="button"
            aria-label="Dismiss"
            onClick={() => setErrorMsg("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* Topbar with Brand Badge & Language Toggle */}
      <div className="ref-topbar">
        <div className="ref-brand-badge">
          <div className="ref-badge-seal">
            <span className="ref-badge-icon">🍕</span>
            <div className="ref-badge-ring">
              <span className="ref-badge-text-top">CANTEEN</span>
              <span className="ref-badge-text-bot">CAMPUS FOOD</span>
            </div>
          </div>
        </div>

        <div className="ref-top-controls">
          {toggleLang && (
            <button className="lang-toggle ref-lang-btn" type="button" onClick={toggleLang}>
              🌐 {lang === "en" ? "தமிழ்" : "English"}
            </button>
          )}
          <span
            className="role-pill customer"
            style={{
              background: "#fff7ed",
              color: "#c2410c",
              borderColor: "#fed7aa",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: 700,
            }}
          >
            <ShieldCheckIcon size={14} /> SECURE RESET
          </span>
        </div>
      </div>

      {/* Main Form Center Container */}
      <div
        className="ref-center-container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          width: "100%",
          maxWidth: "460px",
          padding: "24px 20px",
          zIndex: 10,
        }}
      >
        <div className="ref-header-group" style={{ width: "100%", maxWidth: 440, boxSizing: "border-box" }}>
          <h1 className="ref-page-title" style={{ color: "#073B30", fontWeight: 800 }}>
            {step === 1 && (lang === "ta" ? "கடவுச்சொல்லை மீட்டமைக்க" : "Forgot Password")}
            {step === 2 && (lang === "ta" ? "மின்னஞ்சலைச் சரிபார்க்கவும்" : "Verify Your Email")}
            {step === 3 && (lang === "ta" ? "புதிய கடவுச்சொல்" : "Create New Password")}
            {step === 4 && (lang === "ta" ? "வெற்றி!" : "Password Reset Successful ✓")}
          </h1>
          <p className="ref-page-subtitle">
            {step === 1 &&
              (lang === "ta"
                ? "உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் முகவரியை உள்ளிட்டால் சரிபார்ப்புக் குறியீடு அனுப்பப்படும்."
                : "Enter your registered email address and we'll send you a verification code.")}
            {step === 2 &&
              (lang === "ta"
                ? `சரிபார்ப்புக் குறியீடு அனுப்பப்பட்ட மின்னஞ்சல்:`
                : `We sent a verification code to:`)}
            {step === 3 &&
              (lang === "ta"
                ? "உங்கள் கணக்கிற்கு பாதுகாப்பான புதிய கடவுச்சொல்லை அமைக்கவும்."
                : "Choose a secure new password for your Campus Canteen account.")}
            {step === 4 &&
              (lang === "ta"
                ? "உங்கள் கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது."
                : "Your password has been updated successfully.")}
          </p>
        </div>

        {/* ── STEP 1: FORGOT PASSWORD PAGE ─────────────────────────── */}
        {step === 1 && (
          <form
            className="ref-card"
            onSubmit={handleRequestOtp}
            style={{ width: "100%", maxWidth: 440, boxSizing: "border-box" }}
          >
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 8,
              }}
            >
              {lang === "ta" ? "மின்னஞ்சல் முகவரி" : "Email Address"}
            </label>

            <div className="ref-input-pill-wrap">
              <span className="ref-input-icon">
                <MailIcon size={18} />
              </span>
              <input
                type="email"
                className="ref-pill-input"
                placeholder={lang === "ta" ? "student@example.com" : "student@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
                disabled={loading}
              />
            </div>

            <button
              className="ref-cta-btn"
              type="submit"
              disabled={loading}
              style={{
                marginTop: 20,
                background: "linear-gradient(135deg, #F5B800 0%, #D9A000 100%)",
                color: "#111827",
                fontWeight: 800,
                letterSpacing: "0.5px",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span className="otp-spinner" /> {lang === "ta" ? "அனுப்புகிறது..." : "Sending..."}
                </span>
              ) : (
                lang === "ta" ? "சரிபார்ப்புக் குறியீட்டை அனுப்புக" : "Send Verification Code"
              )}
            </button>

            <button
              type="button"
              className="ref-sub-link-btn"
              onClick={() => onNavigate("login")}
              style={{
                marginTop: 18,
                background: "none",
                border: "none",
                color: "#64748B",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                fontWeight: 600,
              }}
            >
              <ArrowLeftIcon size={15} /> {lang === "ta" ? "உள்நுழைவுக்குத் திரும்பு" : "Back to Login"}
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP VERIFICATION PAGE ────────────────────────── */}
        {step === 2 && (
          <form
            className="ref-card"
            onSubmit={handleVerifyOtp}
            style={{ width: "100%", maxWidth: 440, boxSizing: "border-box" }}
          >
            {/* Recipient Badge */}
            <div
              style={{
                background: "rgba(7, 59, 48, 0.06)",
                border: "1px dashed rgba(7, 59, 48, 0.25)",
                borderRadius: 12,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
                fontSize: 13,
                color: "#073B30",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                <MailIcon size={14} /> {email}
              </span>
              <button
                type="button"
                onClick={() => transitionToStep(1, "forgot-password")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#D9A000",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {lang === "ta" ? "மாற்று" : "Change"}
              </button>
            </div>

            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {lang === "ta" ? "6 இலக்க சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்" : "Enter 6-digit verification code"}
            </label>

            {/* 6 Digit Input Boxes */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                margin: "16px 0",
              }}
            >
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  style={{
                    width: "48px",
                    height: "56px",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "800",
                    fontFamily: "var(--font-mono, monospace)",
                    borderRadius: "12px",
                    border: digit ? "2px solid #073B30" : "1.5px solid rgba(148, 163, 184, 0.4)",
                    background: digit ? "#FEF9EE" : "rgba(255, 255, 255, 0.95)",
                    color: "#073B30",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: digit ? "0 4px 12px rgba(245, 184, 0, 0.2)" : "none",
                  }}
                  disabled={loading}
                />
              ))}
            </div>

            {/* Expiry Timer & Attempts */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12.5,
                margin: "10px 0 18px 0",
                color: otpSecondsLeft < 60 ? "#dc2626" : "#64748B",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                <ClockIcon size={14} />
                {otpSecondsLeft > 0 ? (
                  <>
                    {lang === "ta" ? "காலாவதியாகிறது:" : "Code expires in:"}{" "}
                    <span style={{ fontFamily: "monospace", fontWeight: 700 }}>
                      {formatTimer(otpSecondsLeft)}
                    </span>
                  </>
                ) : (
                  <span style={{ color: "#dc2626", fontWeight: 700 }}>
                    {lang === "ta" ? "குறியீடு காலாவதியானது!" : "Verification code expired."}
                  </span>
                )}
              </span>

              {remainingAttempts !== null && (
                <span style={{ fontSize: 12, color: "#d97706", fontWeight: 600 }}>
                  {remainingAttempts} {lang === "ta" ? "முயற்சிகள்" : "attempts left"}
                </span>
              )}
            </div>

            {/* Verify Code Button */}
            <button
              className="ref-cta-btn"
              type="submit"
              disabled={loading || otpSecondsLeft <= 0}
              style={{
                background: "linear-gradient(135deg, #F5B800 0%, #D9A000 100%)",
                color: "#111827",
                fontWeight: 800,
                letterSpacing: "0.5px",
                opacity: loading || otpSecondsLeft <= 0 ? 0.65 : 1,
                cursor: loading || otpSecondsLeft <= 0 ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span className="otp-spinner" /> {lang === "ta" ? "சரிபார்க்கிறது..." : "Verifying..."}
                </span>
              ) : (
                lang === "ta" ? "குறியீட்டைச் சரிபார்க்கவும்" : "Verify Code"
              )}
            </button>

            {/* Resend Section */}
            <div style={{ textAlign: "center", marginTop: 18 }}>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>
                {lang === "ta" ? "குறியீடு கிடைக்கவில்லையா?" : "Didn't receive the code?"}
              </div>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                style={{
                  background: "none",
                  border: "none",
                  color: resendCooldown > 0 ? "#94A3B8" : "#073B30",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: resendCooldown > 0 ? "default" : "pointer",
                  textDecoration: resendCooldown > 0 ? "none" : "underline",
                }}
              >
                {resendCooldown > 0
                  ? `${lang === "ta" ? "மீண்டும் அனுப்ப" : "Resend code in"} ${resendCooldown} seconds`
                  : lang === "ta"
                    ? "மீண்டும் குறியீட்டை அனுப்புக"
                    : "Resend Code"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("login")}
              style={{
                marginTop: 16,
                background: "none",
                border: "none",
                color: "#64748B",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                fontWeight: 600,
              }}
            >
              <ArrowLeftIcon size={14} /> {lang === "ta" ? "உள்நுழைவுக்குத் திரும்பு" : "Back to Login"}
            </button>
          </form>
        )}

        {/* ── STEP 3: CREATE NEW PASSWORD PAGE ─────────────────────── */}
        {step === 3 && (
          <form
            className="ref-card"
            onSubmit={handleResetPassword}
            style={{ width: "100%", maxWidth: 440, boxSizing: "border-box" }}
          >
            {/* New Password */}
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 6,
              }}
            >
              {lang === "ta" ? "புதிய கடவுச்சொல்" : "New Password"}
            </label>
            <div className="ref-input-pill-wrap">
              <span className="ref-input-icon">
                <LockIcon size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="ref-pill-input"
                placeholder={lang === "ta" ? "புதிய கடவுச்சொல்லை உள்ளிடவும்" : "Enter new password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus
                required
                disabled={loading}
              />
              <button
                type="button"
                className="ref-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>

            {/* Confirm New Password */}
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                color: "#111827",
                marginTop: 14,
                marginBottom: 6,
              }}
            >
              {lang === "ta" ? "கடவுச்சொல்லை உறுதிப்படுத்தவும்" : "Confirm New Password"}
            </label>
            <div className="ref-input-pill-wrap">
              <span className="ref-input-icon">
                <LockIcon size={18} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="ref-pill-input"
                placeholder={lang === "ta" ? "மீண்டும் உள்ளிடவும்" : "Re-enter new password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="ref-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>

            {/* Interactive Password Requirements Checklist */}
            <div
              style={{
                background: "rgba(248, 250, 252, 0.9)",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "12px 16px",
                marginTop: 16,
                fontSize: 12,
                color: "#475569",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 8, color: "#111827" }}>
                {lang === "ta" ? "கடவுச்சொல் தேவைகள்:" : "Password requirements:"}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px 12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: ruleMinLength ? "#16a34a" : "#64748B", fontWeight: ruleMinLength ? 600 : 400 }}>
                  <CheckIcon size={13} /> Minimum 8 characters
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: ruleUppercase ? "#16a34a" : "#64748B", fontWeight: ruleUppercase ? 600 : 400 }}>
                  <CheckIcon size={13} /> Uppercase letter
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: ruleLowercase ? "#16a34a" : "#64748B", fontWeight: ruleLowercase ? 600 : 400 }}>
                  <CheckIcon size={13} /> Lowercase letter
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: ruleNumber ? "#16a34a" : "#64748B", fontWeight: ruleNumber ? 600 : 400 }}>
                  <CheckIcon size={13} /> Number (0-9)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: ruleSpecial ? "#16a34a" : "#64748B", fontWeight: ruleSpecial ? 600 : 400, gridColumn: "span 2" }}>
                  <CheckIcon size={13} /> Special character (!@#$%^&*)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: ruleMatch ? "#16a34a" : "#64748B", fontWeight: ruleMatch ? 600 : 400, gridColumn: "span 2", borderTop: "1px solid #E2E8F0", paddingTop: 4, marginTop: 2 }}>
                  <CheckIcon size={13} /> Passwords match
                </div>
              </div>
            </div>

            {/* Reset Password Button */}
            <button
              className="ref-cta-btn"
              type="submit"
              disabled={loading || !allRulesPassed}
              style={{
                marginTop: 20,
                background: allRulesPassed
                  ? "linear-gradient(135deg, #F5B800 0%, #D9A000 100%)"
                  : "#E2E8F0",
                color: allRulesPassed ? "#111827" : "#94A3B8",
                fontWeight: 800,
                letterSpacing: "0.5px",
                opacity: loading ? 0.75 : 1,
                cursor: allRulesPassed ? "pointer" : "not-allowed",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span className="otp-spinner" /> {lang === "ta" ? "மாற்றுகிறது..." : "Resetting..."}
                </span>
              ) : (
                lang === "ta" ? "கடவுச்சொல்லை மாற்றவும்" : "Reset Password"
              )}
            </button>
          </form>
        )}

        {/* ── STEP 4: SUCCESS PAGE ─────────────────────────────────── */}
        {step === 4 && (
          <div
            className="ref-card"
            style={{
              width: "100%",
              maxWidth: 440,
              boxSizing: "border-box",
              textAlign: "center",
              padding: "40px 30px",
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "#ecfdf5",
                color: "#059669",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                border: "2px solid #a7f3d0",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.2)",
              }}
            >
              <CheckIcon size={36} />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#073B30", margin: "0 0 10px 0" }}>
              {lang === "ta" ? "கடவுச்சொல் மாற்றப்பட்டது! ✓" : "Password Reset Successful ✓"}
            </h2>

            <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.6, margin: "0 0 26px 0" }}>
              {lang === "ta"
                ? "உங்கள் கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது. புதிய கடவுச்சொல்லுடன் உள்நுழையலாம்."
                : "Your password has been updated successfully."}
            </p>

            <button
              className="ref-cta-btn"
              type="button"
              onClick={() => onNavigate("login")}
              style={{
                background: "linear-gradient(135deg, #F5B800 0%, #D9A000 100%)",
                color: "#111827",
                fontWeight: 800,
                letterSpacing: "0.5px",
              }}
            >
              {lang === "ta" ? "உள்நுழையவும்" : "Login Now"}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Footer Bar */}
      <footer className="ref-footer">
        <div className="ref-footer-nav">
          <span className="ref-foot-link">Explore</span>
          <span className="ref-foot-link">Menu</span>
          <span className="ref-foot-link">Help & Feedback</span>
          <span className="ref-foot-link">Contact</span>
        </div>
        <div className="ref-footer-right">
          <div className="ref-social-minis">
            <span style={{ fontWeight: 800, color: "#1877f2" }}>f</span>
            <span style={{ color: "#ea4335" }}>G+</span>
            <span style={{ color: "#0f172a", fontWeight: 800 }}>𝕏</span>
          </div>
          <div className="ref-copyright">
            © {new Date().getFullYear()} Campus Canteen. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Embedded styles for OTP Spinner */}
      <style>{`
        .otp-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #111827;
          border-top-color: transparent;
          border-radius: 50%;
          animation: otpSpin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes otpSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
