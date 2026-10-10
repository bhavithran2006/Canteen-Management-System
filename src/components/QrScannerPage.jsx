import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrScannerPage({ onNavigate, useCanteenHook }) {
  const { user, canteens, orderHistory, updateOrderStatus, lang, t } = useCanteenHook();

  // Active Canteen selected by staff (defaults to "main" CS Canteen or saved preference)
  const [activeCanteenId, setActiveCanteenId] = useState(() => {
    try {
      return localStorage.getItem("canteen_staff_canteen_id") || "main";
    } catch {
      return "main";
    }
  });

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [manualToken, setManualToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Scanned order inspection state
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [verifyError, setVerifyError] = useState("");
  const [canteenMismatch, setCanteenMismatch] = useState(false);
  const [alreadyCollected, setAlreadyCollected] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const scannerRef = useRef(null);
  const scannerContainerId = "canteen-qr-reader";

  const activeCanteen = canteens.find((c) => c.id === activeCanteenId) || canteens[0];

  const handleCanteenChange = (id) => {
    setActiveCanteenId(id);
    try {
      localStorage.setItem("canteen_staff_canteen_id", id);
    } catch {}
    // Reset any scanned state if staff changes canteen
    setVerifiedOrder(null);
    setVerifyError("");
    setCanteenMismatch(false);
    setAlreadyCollected(false);
  };

  // ── Verification against Backend API & local fallback ──────────────────
  const verifyTokenString = useCallback(
    async (rawToken) => {
      if (!rawToken || !rawToken.trim()) return;
      const cleanToken = rawToken.trim();

      setVerifying(true);
      setVerifyError("");
      setCanteenMismatch(false);
      setAlreadyCollected(false);
      setSuccessMessage("");

      try {
        // 1. Try real backend API
        const res = await fetch("http://localhost:5000/api/orders/qr-verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user?.id || "STAFF-01",
            "x-user-name": user?.name || "Staff",
            "x-user-role": user?.role || "admin",
          },
          body: JSON.stringify({
            qrToken: cleanToken,
            staffCanteenId: activeCanteenId,
          }),
        });

        const data = await res.json();

        if (res.ok && data.valid) {
          setVerifiedOrder(data.order);
          // Play subtle success chime if browser allows audio
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          } catch (e) {}
        } else {
          // Backend returned error (e.g. Canteen mismatch or already collected)
          if (data.canteenMismatch) {
            setCanteenMismatch(true);
            setVerifiedOrder(data.order);
            setVerifyError(data.error || "Canteen Mismatch: Order belongs to another canteen.");
          } else if (data.alreadyCollected) {
            setAlreadyCollected(true);
            setVerifiedOrder(data.order);
            setVerifyError(data.error || "This order has already been collected.");
          } else {
            setVerifyError(data.error || "Invalid QR code or Token. No matching order found.");
          }
        }
      } catch (err) {
        // Backend offline fallback: check local orderHistory
        console.warn("Backend API not reachable, falling back to local orders:", err);
        let tokenToFind = cleanToken;
        if (cleanToken.startsWith("{") && cleanToken.endsWith("}")) {
          try {
            const p = JSON.parse(cleanToken);
            tokenToFind = p.t || p.oid || cleanToken;
          } catch (e) {}
        }

        const localMatch = (orderHistory || []).find(
          (o) =>
            o.qrToken === tokenToFind ||
            o.id === tokenToFind ||
            o.token === tokenToFind ||
            (tokenToFind.length > 5 && o.id.toLowerCase().includes(tokenToFind.toLowerCase()))
        );

        if (localMatch) {
          if (localMatch.canteenId && localMatch.canteenId !== activeCanteenId) {
            setCanteenMismatch(true);
            setVerifiedOrder(localMatch);
            setVerifyError(`Canteen Mismatch! This order was placed at "${localMatch.canteenName || localMatch.canteenId}". Staff at this canteen cannot collect this order.`);
          } else if (localMatch.status === 3 || localMatch.qrUsed) {
            setAlreadyCollected(true);
            setVerifiedOrder(localMatch);
            setVerifyError("This order has already been collected.");
          } else {
            setVerifiedOrder(localMatch);
          }
        } else {
          setVerifyError("Invalid QR code or Token. No matching order found.");
        }
      } finally {
        setVerifying(false);
      }
    },
    [activeCanteenId, orderHistory, user]
  );

  // ── Start / Stop Camera Scanner ─────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {}
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Pause camera scanning temporarily on successful read
          if (html5QrCode.isScanning) {
            html5QrCode.pause(true);
          }
          verifyTokenString(decodedText);
        },
        () => {
          // Frame parse error — normal while hunting for QR code
        }
      );

      setCameraActive(true);
    } catch (err) {
      console.warn("Camera start failed:", err);
      setCameraActive(false);
      setCameraError(
        "Camera permission is required to scan QR codes. Please allow camera access in your browser, or enter the Token number manually below."
      );
    }
  }, [facingMode, verifyTokenString]);

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (e) {}
      scannerRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Initialize camera on mount, cleanup on unmount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const toggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    verifyTokenString(manualToken);
  };

  // ── Confirm Product Handover ─────────────────────────────────────────
  const handleConfirmPickup = async () => {
    if (!verifiedOrder) return;
    setConfirming(true);
    setVerifyError("");

    const orderId = verifiedOrder.id;
    const token = verifiedOrder.qrToken || verifiedOrder.id;

    try {
      // Call backend API
      const res = await fetch("http://localhost:5000/api/orders/qr-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "STAFF-01",
          "x-user-name": user?.name || "Canteen Staff",
          "x-user-role": user?.role || "admin",
        },
        body: JSON.stringify({
          qrToken: token,
          staffCanteenId: activeCanteenId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update local React state so customer and admin views update immediately
        updateOrderStatus(orderId, 3);

        setVerifiedOrder({
          ...verifiedOrder,
          status: 3,
          qrUsed: true,
          pickedUpAt: new Date().toISOString(),
          pickedUpByStaffName: user?.name || "Canteen Staff",
        });

        setSuccessMessage(
          `🎉 Order Handover Complete! Order ${orderId} (Token ${verifiedOrder.token}) successfully collected.`
        );

        // Resume scanner after 3 seconds or on button click
      } else {
        setVerifyError(data.error || "Failed to confirm pickup.");
      }
    } catch (err) {
      // Fallback local update
      console.warn("Backend confirm failed, updating locally:", err);
      updateOrderStatus(orderId, 3);
      setVerifiedOrder({
        ...verifiedOrder,
        status: 3,
        qrUsed: true,
        pickedUpAt: new Date().toISOString(),
        pickedUpByStaffName: user?.name || "Canteen Staff",
      });
      setSuccessMessage(
        `🎉 Order Handover Complete! Order ${orderId} (Token ${verifiedOrder.token}) successfully collected.`
      );
    } finally {
      setConfirming(false);
    }
  };

  const handleResetForNextScan = () => {
    setVerifiedOrder(null);
    setVerifyError("");
    setCanteenMismatch(false);
    setAlreadyCollected(false);
    setSuccessMessage("");
    setManualToken("");
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.resume();
    } else {
      startCamera();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, minHeight: 0 }}>
      {/* Header Banner */}
      <div className="admin-header-banner" style={{ padding: "16px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="back"
              onClick={() => onNavigate("kitchen-orders")}
              style={{ color: "var(--coral)", background: "rgba(255,255,255,0.1)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ←
            </button>
            <div>
              <div className="admin-badge-top" style={{ marginBottom: 2 }}>
                📷 {lang === "ta" ? "நேரலை க்யூஆர் சரிபார்ப்பு & ஒப்படைப்பு" : "LIVE QR VERIFICATION & HANDOVER"}
              </div>
              <h1 className="admin-banner-title" style={{ margin: 0, fontSize: 20 }}>
                {lang === "ta" ? "கேண்டீன் க்யூஆர் ஸ்கேனர்" : "Canteen Staff QR Scanner"}
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="crowd-live-badge" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
              <i style={{ background: "#10b981" }} /> Scanner Ready
            </span>
          </div>
        </div>

        {/* Operating Canteen Selector Bar */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--coral)" }}>
            🏢 {lang === "ta" ? "உங்கள் தற்போதைய கவுண்டர் உணவகம்:" : "Operating Counter / Canteen:"}
          </span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {canteens.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCanteenChange(c.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  border: activeCanteenId === c.id ? "2px solid var(--coral)" : "1px solid rgba(255,255,255,0.2)",
                  background: activeCanteenId === c.id ? "var(--coral)" : "rgba(255,255,255,0.08)",
                  color: activeCanteenId === c.id ? "#1f1a0f" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {c.id === "main" ? "🏫" : c.id === "hostel" ? "🏢" : "🔧"} {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, overflowY: "auto", padding: "18px 20px 40px", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        {/* Success Banner */}
        {successMessage && (
          <div className="qr-success-card" style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 32 }}>🎉</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--basil)" }}>
                {lang === "ta" ? "ஆர்டர் வெற்றிகரமாக ஒப்படைக்கப்பட்டது!" : "Order Handover Confirmed!"}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{successMessage}</div>
            </div>
            <button className="cta-mini" onClick={handleResetForNextScan} style={{ background: "var(--basil)", color: "#fff", padding: "8px 16px" }}>
              {lang === "ta" ? "அடுத்த ஆர்டரை ஸ்கேன் செய் →" : "Scan Next Order →"}
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: verifiedOrder ? "1fr 1fr" : "1fr", gap: 20 }}>
          {/* Left Column: Camera Scanner & Manual Input */}
          <div>
            <div className="scanner-container-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>📷</span>
                  <span>{lang === "ta" ? "கேமரா ஸ்கேனர்" : "Camera Viewfinder"}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={toggleFacingMode}
                    className="icon-btn on-light"
                    title="Flip camera"
                    style={{ fontSize: 12, padding: "4px 8px" }}
                  >
                    🔄 Flip
                  </button>
                  {cameraActive ? (
                    <button
                      onClick={stopCamera}
                      className="icon-btn on-light"
                      style={{ fontSize: 12, padding: "4px 8px", color: "var(--rose)" }}
                    >
                      ⏹️ Stop
                    </button>
                  ) : (
                    <button
                      onClick={startCamera}
                      className="icon-btn on-light"
                      style={{ fontSize: 12, padding: "4px 8px", color: "var(--basil)" }}
                    >
                      ▶️ Start
                    </button>
                  )}
                </div>
              </div>

              {/* Viewfinder box */}
              <div className="scanner-viewfinder-wrap">
                <div id={scannerContainerId} style={{ width: "100%", minHeight: 260 }} />
                {cameraActive && <div className="scanner-laser-beam" />}
              </div>

              {cameraError && (
                <div className="camera-error-banner" style={{ marginTop: 12 }}>
                  <div>⚠️ {cameraError}</div>
                  <button className="cta-mini" onClick={startCamera} style={{ marginTop: 6 }}>
                    🔄 Retry Camera Permission
                  </button>
                </div>
              )}
            </div>

            {/* Manual Token / Order ID Entry Box */}
            <div className="manual-entry-card" style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span>⌨️</span>
                <span>{lang === "ta" ? "அல்லது டோக்கன் / ஆர்டர் ஐடி கைமுறையாக உள்ளிடுக" : "Or Enter Token / Order ID Manually"}</span>
              </div>
              <form onSubmit={handleManualSubmit} style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  className="adv-input"
                  placeholder="e.g. A-14, ORD-4821, or QR code"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  style={{ flex: 1, padding: "10px 14px" }}
                />
                <button
                  type="submit"
                  className="adv-submit-btn"
                  disabled={verifying || !manualToken.trim()}
                  style={{ width: "auto", margin: 0, padding: "10px 18px", fontSize: 13.5 }}
                >
                  {verifying ? "Checking..." : "🔍 Verify"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Verified Order Details & Handover Confirmation */}
          {verifiedOrder && (
            <div className="verified-order-panel">
              {/* Canteen Mismatch Alert */}
              {canteenMismatch && (
                <div className="canteen-mismatch-banner" style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 24 }}>🚫</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--rose)" }}>
                      CANTEEN MISMATCH DETECTED!
                    </div>
                    <div style={{ fontSize: 12, marginTop: 3 }}>
                      This order was placed for <b>{verifiedOrder.canteenName || "another canteen"}</b>.
                      <br />
                      You are currently operating at <b>{activeCanteen.name}</b>.
                      <br />
                      <span style={{ color: "var(--rose)", fontWeight: 700 }}>
                        Handover is blocked to protect student orders.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Already Collected Alert */}
              {alreadyCollected && (
                <div className="already-collected-banner" style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 24 }}>⚠️</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#d97706" }}>
                      THIS ORDER HAS ALREADY BEEN COLLECTED!
                    </div>
                    <div style={{ fontSize: 12, marginTop: 3 }}>
                      Picked up at:{" "}
                      <b>
                        {new Date(verifiedOrder.pickedUpAt || verifiedOrder.completedTime || Date.now()).toLocaleString()}
                      </b>
                      {verifiedOrder.pickedUpByStaffName && (
                        <span> by staff: <b>{verifiedOrder.pickedUpByStaffName}</b></span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Inspection Card */}
              <div className="order-inspect-card">
                <div className="inspect-head">
                  <div>
                    <span className="ot-token" style={{ fontSize: 22 }}>{verifiedOrder.token}</span>
                    <span className="ot-id" style={{ marginLeft: 8 }}>{verifiedOrder.id}</span>
                  </div>
                  <span
                    className="ot-badge"
                    style={{
                      background:
                        verifiedOrder.status === 3
                          ? "rgba(16,185,129,0.15)"
                          : verifiedOrder.status === 2
                          ? "rgba(62,122,79,0.15)"
                          : "rgba(204,122,0,0.15)",
                      color:
                        verifiedOrder.status === 3
                          ? "var(--emerald)"
                          : verifiedOrder.status === 2
                          ? "var(--basil)"
                          : "var(--amber)",
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    {verifiedOrder.status === 3
                      ? "✅ Collected"
                      : verifiedOrder.status === 2
                      ? "🍽️ Ready for Pickup"
                      : "⏳ Preparing"}
                  </span>
                </div>

                <div style={{ margin: "14px 0", padding: "12px", background: "rgba(0,0,0,0.03)", borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Canteen & Pickup Counter:</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--fg)", marginTop: 2 }}>
                    📍 {verifiedOrder.canteenName || "Campus Canteen"} · Counter #{verifiedOrder.counter || 1}
                  </div>
                </div>

                {/* Items Checklist */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8, color: "var(--muted)" }}>
                    📦 ITEMS TO HAND OVER ({verifiedOrder.items?.length || 0}):
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(verifiedOrder.items || []).map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          background: "var(--surface)",
                          borderRadius: 10,
                          border: "1px solid var(--surface-border)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: 14, color: "var(--coral-d)" }}>{it.qty}×</span>
                          <span style={{ fontWeight: 700, fontSize: 13.5 }}>{it.name}</span>
                        </div>
                        <span className="mono" style={{ fontWeight: 700, fontSize: 13 }}>₹{it.price * it.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px dashed var(--line)", marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Payment: </span>
                    <span style={{ fontWeight: 800, color: "var(--basil)" }}>✅ {verifiedOrder.paymentStatus || "PAID"} ({verifiedOrder.paymentMode})</span>
                  </div>
                  <div className="mono" style={{ fontWeight: 900, fontSize: 17 }}>Total: ₹{verifiedOrder.total}</div>
                </div>

                {/* Action Buttons */}
                {!canteenMismatch && !alreadyCollected && (
                  <button
                    className="adv-submit-btn"
                    onClick={handleConfirmPickup}
                    disabled={confirming}
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: 800,
                      padding: "16px 0",
                      boxShadow: "0 10px 24px rgba(16,185,129,0.35)",
                    }}
                  >
                    {confirming ? "Confirming..." : "✅ Confirm Pickup & Complete Handover"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetForNextScan}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: "10px 0",
                    background: "transparent",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  Clear & Scan Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
