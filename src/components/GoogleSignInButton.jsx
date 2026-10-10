import React, { useEffect, useRef, useState, useCallback } from "react";
import "./GoogleSignInButton.css";

// Official Google "G" multicolor SVG icon
const GoogleIcon = () => (
  <svg className="canteen-google-icon-svg" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27A7.06 7.06 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.24A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.24 5.42l4.04-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15C6.23 6.85 8.88 4.75 12 4.75z"
    />
  </svg>
);

const API_BASE = "http://localhost:5000/api/auth";

export default function GoogleSignInButton({
  mode = "login",
  lang = "en",
  onSuccess,
  onError,
  disabled = false,
}) {
  const gisContainerRef = useRef(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Account Linking Modal state (OWASP protection for existing accounts)
  const [linkModalData, setLinkModalData] = useState(null); // { email, idToken }
  const [linkPassword, setLinkPassword] = useState("");
  const [showLinkPassword, setShowLinkPassword] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  // Read frontend Google Client ID from Vite environment
  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const clientId = rawClientId.trim();
  const isPlaceholderId =
    !clientId ||
    clientId.includes("your-google-client-id") ||
    clientId === "undefined";

  // 1. Process Google ID token with backend authentication endpoint
  const authenticateWithBackend = useCallback(
    async (idToken, passwordToLink = null) => {
      // Prevent duplicate login requests
      if (isSubmitting) return;

      setIsSubmitting(true);
      setStatusMessage(
        lang === "ta"
          ? "கூகிள் சரிபார்க்கப்படுகிறது..."
          : "Verifying with Google..."
      );

      try {
        const payload = { idToken };
        if (passwordToLink) {
          payload.linkPassword = passwordToLink;
        }

        const res = await fetch(`${API_BASE}/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        // Check if account already exists with password and requires secure linking
        if (
          res.status === 409 &&
          data.code === "ACCOUNT_EXISTS_NEEDS_LINKING"
        ) {
          setIsSubmitting(false);
          setStatusMessage("");
          setLinkModalData({
            email: data.email,
            idToken,
            message: data.error,
          });
          setLinkPassword("");
          setLinkError("");
          return;
        }

        if (!res.ok) {
          const message =
            data.error ||
            data.message ||
            (lang === "ta"
              ? "கூகிள் உள்நுழைவு தோல்வியடைந்தது."
              : "Google authentication failed. Please try again.");
          if (onError) onError(message);
          setIsSubmitting(false);
          setStatusMessage("");
          return;
        }

        // Authentication Success
        setIsSubmitting(false);
        setStatusMessage("");
        setLinkModalData(null);

        if (onSuccess) {
          onSuccess({
            token: data.token,
            user: data.user,
            message: data.message,
          });
        }
      } catch (err) {
        console.error("[GoogleSignIn] Network error:", err);
        const netErr =
          lang === "ta"
            ? "சேவையகத்தை தொடர்பு கொள்ள முடியவில்லை. பிணையத்தை சரிபார்க்கவும்."
            : "Unable to reach the authentication server. Please check your network connection.";
        if (onError) onError(netErr);
        setIsSubmitting(false);
        setStatusMessage("");
      }
    },
    [isSubmitting, lang, onError, onSuccess]
  );

  // 2. Handle Google Identity Services credential response
  const handleCredentialResponse = useCallback(
    (response) => {
      if (!response || !response.credential) {
        console.warn("[GoogleSignIn] Missing credential in GIS response");
        return;
      }
      authenticateWithBackend(response.credential);
    },
    [authenticateWithBackend]
  );

  // 3. Load official GIS script if not present
  useEffect(() => {
    let scriptTag = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    
    const onScriptReady = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
      }
    };

    if (window.google?.accounts?.id) {
      setGisLoaded(true);
      return;
    }

    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.src = "https://accounts.google.com/gsi/client";
      scriptTag.async = true;
      scriptTag.defer = true;
      scriptTag.onload = onScriptReady;
      document.head.appendChild(scriptTag);
    } else {
      scriptTag.addEventListener("load", onScriptReady);
    }

    // Polling fallback in case already loaded
    const checkTimer = setInterval(() => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
        clearInterval(checkTimer);
      }
    }, 250);

    return () => {
      clearInterval(checkTimer);
      if (scriptTag) scriptTag.removeEventListener("load", onScriptReady);
    };
  }, []);

  // 4. Initialize GIS and render official button when ready and client ID is valid
  useEffect(() => {
    if (!gisLoaded || !window.google?.accounts?.id) return;
    if (isPlaceholderId) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (gisContainerRef.current) {
        gisContainerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(gisContainerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: mode === "register" ? "signup_with" : "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: 320,
        });
      }
    } catch (gisErr) {
      console.warn("[GoogleSignIn] GIS init warning:", gisErr.message);
    }
  }, [gisLoaded, clientId, isPlaceholderId, mode, handleCredentialResponse]);

  // 5. Button click trigger (invokes Google prompt / One Tap or notifies if setup needed)
  const handleButtonClick = () => {
    if (disabled || isSubmitting) return;

    if (isPlaceholderId) {
      const msg =
        lang === "ta"
          ? "கூகிள் கிளையன்ட் ஐடி கட்டமைக்கப்படவில்லை. தயவுசெய்து backend/.env மற்றும் .env-ல் GOOGLE_CLIENT_ID-ஐ அமைக்கவும்."
          : "Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID in your .env files.";
      if (onError) onError(msg);
      return;
    }

    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("[GoogleSignIn] Prompt state:", notification.getNotDisplayedReason?.() || "skipped");
          }
        });
      } catch (promptErr) {
        console.warn("[GoogleSignIn] Prompt trigger:", promptErr.message);
      }
    }
  };

  // 6. Handle submission of password for existing account linking
  const handleLinkSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!linkPassword) {
      setLinkError(
        lang === "ta"
          ? "உங்கள் கணக்கின் கடவுச்சொல்லை உள்ளிடவும்."
          : "Please enter your existing password to link."
      );
      return;
    }

    setIsLinking(true);
    setLinkError("");

    try {
      const res = await fetch(`${API_BASE}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: linkModalData.idToken,
          linkPassword: linkPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLinkError(
          data.error ||
            (lang === "ta"
              ? "தவறான கடவுச்சொல். மீண்டும் முயற்சிக்கவும்."
              : "Incorrect password. Unable to link Google account.")
        );
        setIsLinking(false);
        return;
      }

      // Successfully linked!
      setIsLinking(false);
      setLinkModalData(null);
      if (onSuccess) {
        onSuccess({
          token: data.token,
          user: data.user,
          message: data.message,
        });
      }
    } catch (err) {
      setLinkError(
        lang === "ta"
          ? "சேவையக பிழை. மீண்டும் முயற்சிக்கவும்."
          : "Network error during account linking. Please try again."
      );
      setIsLinking(false);
    }
  };

  const buttonLabel = isSubmitting
    ? statusMessage || (lang === "ta" ? "சரிபார்க்கப்படுகிறது..." : "Verifying...")
    : mode === "register"
    ? lang === "ta"
      ? "கூகிள் மூலம் பதிவுசெய்க"
      : "Sign up with Google"
    : lang === "ta"
    ? "கூகிள் மூலம் தொடரவும்"
    : "Continue with Google";

  return (
    <div className="canteen-google-auth-wrap">
      {/* Official GIS Button container if Client ID is configured and rendered */}
      {!isPlaceholderId && (
        <div
          ref={gisContainerRef}
          className="canteen-google-gis-container"
          style={{ display: isSubmitting ? "none" : "flex" }}
        />
      )}

      {/* Branded Campus Canteen fallback/standard button */}
      {(isPlaceholderId || isSubmitting) && (
        <button
          type="button"
          className="canteen-google-btn"
          onClick={handleButtonClick}
          disabled={disabled || isSubmitting}
          title={buttonLabel}
          aria-label={buttonLabel}
        >
          {isSubmitting ? (
            <span className="canteen-google-spinner" />
          ) : (
            <GoogleIcon />
          )}
          <span className="canteen-google-btn-text">{buttonLabel}</span>
        </button>
      )}

      {/* Account Linking Modal (OWASP Account Hijacking Protection) */}
      {linkModalData && (
        <div className="canteen-link-modal-overlay" role="dialog" aria-modal="true">
          <div className="canteen-link-modal-card">
            <div className="canteen-link-modal-header">
              <div className="canteen-link-modal-badge">🔐</div>
              <div>
                <h3 className="canteen-link-modal-title">
                  {lang === "ta" ? "கணக்கை பாதுகாப்பாக இணைக்கவும்" : "Secure Account Linking"}
                </h3>
              </div>
            </div>

            <p className="canteen-link-modal-desc">
              {lang === "ta" ? (
                <>
                  <span className="canteen-link-email-highlight">{linkModalData.email}</span> என்ற
                  மின்னஞ்சலில் ஏற்கனவே கணக்கு உள்ளது. அங்கீகரிக்கப்படாத அணுகலைத் தடுக்க,
                  உங்கள் கடவுச்சொல்லை உள்ளிட்டு கூகிள் கணக்கை இணைக்கவும்.
                </>
              ) : (
                <>
                  An existing password account was found for{" "}
                  <span className="canteen-link-email-highlight">{linkModalData.email}</span>.
                  To protect your account, please enter your existing password to link your Google identity.
                </>
              )}
            </p>

            {linkError && (
              <div className="canteen-link-modal-error">
                <span>⚠️</span>
                <span>{linkError}</span>
              </div>
            )}

            <form onSubmit={handleLinkSubmit}>
              <div className="canteen-link-input-wrap">
                <input
                  type={showLinkPassword ? "text" : "password"}
                  className="canteen-link-input"
                  placeholder={lang === "ta" ? "தற்போதைய கடவுச்சொல்" : "Existing account password"}
                  value={linkPassword}
                  onChange={(e) => setLinkPassword(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="canteen-link-eye-btn"
                  onClick={() => setShowLinkPassword(!showLinkPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showLinkPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="canteen-link-actions">
                <button
                  type="button"
                  className="canteen-link-btn-cancel"
                  onClick={() => {
                    setLinkModalData(null);
                    setLinkPassword("");
                    setLinkError("");
                  }}
                  disabled={isLinking}
                >
                  {lang === "ta" ? "ரத்துசெய்" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="canteen-link-btn-submit"
                  disabled={isLinking || !linkPassword}
                >
                  {isLinking ? (
                    <>
                      <span className="canteen-google-spinner" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
                      <span>{lang === "ta" ? "இணைக்கப்படுகிறது..." : "Linking..."}</span>
                    </>
                  ) : (
                    <span>{lang === "ta" ? "இணைத்து உள்நுழைக" : "Link & Continue"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
