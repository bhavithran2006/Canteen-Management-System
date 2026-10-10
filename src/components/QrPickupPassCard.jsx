import React, { useState, useEffect } from "react";
import QRCode from "qrcode";

export function QrPickupPassModal({ order, lang, onClose }) {
  if (!order) return null;

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <div className="qr-modal-title">
            🎫 {lang === "ta" ? "க்யூஆர் பிக்கப் பாஸ்" : "Digital Pickup Pass"}
          </div>
          <button className="qr-modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: "0 10px 10px" }}>
          <QrPickupPassCard order={order} lang={lang} isFullscreen />
        </div>
      </div>
    </div>
  );
}

export default function QrPickupPassCard({ order, lang, isFullscreen = false, onEnlarge }) {
  const [qrUrl, setQrUrl] = useState("");
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    if (!order) return;
    setGenerating(true);

    const token = order.qrToken || order.id;
    const payload = JSON.stringify({
      t: token,
      oid: order.id,
      c: order.canteenId,
    });

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: "H",
      margin: 1.5,
      width: isFullscreen ? 320 : 250,
      color: {
        dark: "#1e293b",
        light: "#ffffff",
      },
    })
      .then((url) => {
        setQrUrl(url);
        setGenerating(false);
      })
      .catch((err) => {
        console.error("QR Generation error:", err);
        setGenerating(false);
      });
  }, [order?.qrToken, order?.id, order?.canteenId, isFullscreen]);

  if (!order) return null;

  const isReady = order.status === 2;
  const isPickedUp = order.status === 3;
  const isCancelled = order.status === -1;

  const canteenEmoji = order.canteenId === "main" ? "🏫" : order.canteenId === "hostel" ? "🏢" : "🔧";

  return (
    <div className={`qr-pass-card ${isReady ? "ready-pulse" : ""} ${isPickedUp ? "picked-up" : ""}`}>
      {/* Pass Header Banner */}
      <div className="qr-pass-header">
        <div>
          <div className="qr-pass-eyebrow">
            🎫 {lang === "ta" ? "ஆர்டர் பிக்கப் பாஸ்" : "OFFICIAL PICKUP PASS"}
          </div>
          <div className="qr-pass-canteen">
            {canteenEmoji} {order.canteenName || "Campus Canteen"}
            {order.canteenLoc && <span className="qr-pass-loc"> · {order.canteenLoc}</span>}
          </div>
        </div>
        <span className={`qr-status-pill ${isPickedUp ? "done" : isReady ? "ready" : "prep"}`}>
          {isPickedUp
            ? (lang === "ta" ? "✅ பெறப்பட்டது" : "✅ Picked Up")
            : isReady
            ? (lang === "ta" ? "🍽️ பெறத் தயார்!" : "🍽️ Ready for Pickup")
            : (lang === "ta" ? "⏳ தயாராகிறது" : "⏳ In Kitchen")}
        </span>
      </div>

      {/* Prominent Ready Alert */}
      {isReady && !isPickedUp && (
        <div className="qr-ready-alert">
          <div className="pulse-circle" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--basil)" }}>
              {lang === "ta" ? "உணவு பெறத் தயார்!" : "Your order is ready for collection!"}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
              {lang === "ta"
                ? `கவுண்டர் #${order.counter || 1} இல் இந்த QR-ஐ ஊழியரிடம் காண்பிக்கவும்.`
                : `Show this QR pass to staff at Counter #${order.counter || 1}.`}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Container */}
      <div className="qr-code-box">
        <div className="qr-img-wrapper" onClick={onEnlarge} title="Click to view fullscreen">
          {generating ? (
            <div className="qr-loading-spinner">
              <span className="spinner-icon">🔄</span>
              <span>Generating Secure QR...</span>
            </div>
          ) : qrUrl ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={qrUrl} alt="Order QR Token" className="qr-img" />
              {isPickedUp && (
                <div className="qr-collected-overlay">
                  <div className="qr-stamp-text">COLLECTED ✓</div>
                </div>
              )}
            </div>
          ) : (
            <div className="qr-fallback-box">
              <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: 2 }}>{order.token}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{order.id}</div>
            </div>
          )}
        </div>

        <div className="qr-scan-hint">
          {isPickedUp ? (
            <span style={{ color: "var(--basil)", fontWeight: 700 }}>
              ✓ {lang === "ta"
                ? `வழங்கப்பட்டது (${new Date(order.pickedUpAt || order.completedTime || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`
                : `Handed over at ${new Date(order.pickedUpAt || order.completedTime || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
            </span>
          ) : (
            <span>
              🔒 {lang === "ta" ? "பாதுகாப்பான ஒருமுறை சரிபார்ப்பு டோக்கன்" : "Secure One-Time Verification QR Code"}
            </span>
          )}
        </div>
      </div>

      {/* Meta Grid */}
      <div className="qr-meta-grid">
        <div className="qr-meta-col">
          <span className="qr-meta-label">{lang === "ta" ? "டோக்கன்" : "TOKEN"}</span>
          <span className="qr-meta-val token-val">{order.token}</span>
        </div>
        <div className="qr-meta-col">
          <span className="qr-meta-label">{lang === "ta" ? "ஆர்டர் ஐடி" : "ORDER ID"}</span>
          <span className="qr-meta-val">{order.id}</span>
        </div>
        <div className="qr-meta-col">
          <span className="qr-meta-label">{lang === "ta" ? "கவுண்டர்" : "COUNTER"}</span>
          <span className="qr-meta-val counter-val">#{order.counter || 1}</span>
        </div>
        <div className="qr-meta-col">
          <span className="qr-meta-label">{lang === "ta" ? "கட்டணம்" : "PAYMENT"}</span>
          <span className="qr-meta-val paid-val">₹{order.total} · {order.paymentStatus || "PAID"}</span>
        </div>
      </div>

      {/* Items list */}
      <div className="qr-items-summary">
        <div className="qr-items-head">{lang === "ta" ? "ஆர்டர் செய்யப்பட்ட உணவுகள்:" : "Ordered Items:"}</div>
        <div className="qr-items-pills">
          {(order.items || []).map((it, idx) => (
            <span key={idx} className="qr-item-pill">
              <b>{it.qty}×</b> {lang === "ta" ? (it.name_ta || it.name) : it.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
