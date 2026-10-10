import React, { useState, useEffect } from "react";
import "./OrderSuccessPage.css";

// ── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = ({ size = 32, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TruckIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

const HomeIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CopyIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export default function OrderSuccessPage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const { lang = "en" } = canteenData;

  const [order, setOrder] = useState(() => {
    try {
      const raw = sessionStorage.getItem("canteen_confirmed_order");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [copied, setCopied] = useState(false);

  // If no confirmed order in session, redirect to home
  useEffect(() => {
    if (!order) {
      // Fallback display if directly opened
      const fallback = {
        id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
        canteenName: "CSE Canteen",
        canteenLoc: "Block A · Ground Floor",
        total: 120,
        paymentMode: "UPI / GPay",
        paymentStatus: "PAID",
        status: 0,
        items: [{ name: "Veg Meal", qty: 1, price: 120 }],
        counter: 2,
        token: "A-42",
      };
      setOrder(fallback);
    }
  }, [order]);

  const handleCopyOrderId = () => {
    if (order?.id) {
      navigator.clipboard?.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!order) return null;

  const isCash =
    order.paymentMode === "CASH" ||
    order.paymentStatus === "PENDING" ||
    order.paymentStatus === "Pending";

  const paymentStatusText = isCash
    ? (lang === "ta" ? "நிலுவையில் (உணவகத்தில் ரொக்கம்)" : "Pending (Cash at Canteen)")
    : (lang === "ta" ? "செலுத்தப்பட்டது (வெற்றி)" : "Paid (Confirmed)");

  const paymentMethodText = (() => {
    const m = (order.paymentMode || order.paymentMethod || "UPI").toUpperCase();
    if (m.includes("CASH")) return lang === "ta" ? "உணவகத்தில் ரொக்கம்" : "Cash at Canteen";
    if (m.includes("CARD")) return lang === "ta" ? "டெபிட் / கிரெடிட் கார்டு" : "Debit / Credit Card";
    if (m.includes("WALLET")) return lang === "ta" ? "வளாக பணப்பை" : "Campus Wallet";
    return "UPI / Online";
  })();

  return (
    <div className="success-page">
      <div className="success-container">
        {/* ── CELEBRATION ICON & HEADINGS ───────────────────────────────── */}
        <div className="success-hero">
          <div className="success-badge-pulse">
            <div className="success-icon-wrap">
              <CheckIcon size={38} color="#ffffff" />
            </div>
            <div className="success-ring-pulse" />
          </div>

          <div className="success-eyebrow">
            {lang === "ta" ? "ஆர்டர் உறுதிப்படுத்தப்பட்டது" : "CONFIRMED & SENT TO KITCHEN"}
          </div>

          <h1 className="success-title">
            {lang === "ta" ? "ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!" : "Order Placed Successfully"}
          </h1>

          <p className="success-subtitle">
            {lang === "ta"
              ? "உங்கள் உணவு விரைவில் தயாரிக்கப்படும். நேரலையில் கண்காணிக்கவும்."
              : "Your food order has been forwarded to the kitchen staff."}
          </p>
        </div>

        {/* ── ORDER DETAILS CARD ────────────────────────────────────────── */}
        <div className="success-card">
          <div className="success-card-top">
            <div className="success-order-id-block">
              <span className="success-label">
                {lang === "ta" ? "ஆர்டர் ஐடி" : "ORDER ID"}
              </span>
              <div className="success-id-row">
                <span className="success-id-val">{order.id}</span>
                <button
                  type="button"
                  className="success-copy-btn"
                  onClick={handleCopyOrderId}
                  title="Copy Order ID"
                >
                  <CopyIcon size={13} color="#073B30" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {order.token && (
              <div className="success-token-chip">
                <span className="token-lbl">TOKEN</span>
                <span className="token-num">{order.token}</span>
              </div>
            )}
          </div>

          <div className="success-divider" />

          {/* Details Grid */}
          <div className="success-info-grid">
            {/* Canteen Name */}
            <div className="success-info-item">
              <div className="info-icon">🏫</div>
              <div className="info-content">
                <div className="info-label">{lang === "ta" ? "உணவகம்" : "Canteen"}</div>
                <div className="info-val">{order.canteenName || "CSE Canteen"}</div>
                {order.canteenLoc && <div className="info-sub">📍 {order.canteenLoc}</div>}
              </div>
            </div>

            {/* Total Amount */}
            <div className="success-info-item">
              <div className="info-icon">💰</div>
              <div className="info-content">
                <div className="info-label">{lang === "ta" ? "மொத்த தொகை" : "Total Amount"}</div>
                <div className="info-val total-highlight">₹{Number(order.total || 0).toFixed(0)}</div>
                <div className="info-sub">{lang === "ta" ? "அனைத்து வரிகளும் அடங்கும்" : "Incl. all taxes"}</div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="success-info-item">
              <div className="info-icon">💳</div>
              <div className="info-content">
                <div className="info-label">{lang === "ta" ? "கட்டண முறை" : "Payment Method"}</div>
                <div className="info-val">{paymentMethodText}</div>
                {order.transactionRef && (
                  <div className="info-sub mono">Ref: {order.transactionRef}</div>
                )}
              </div>
            </div>

            {/* Payment Status */}
            <div className="success-info-item">
              <div className="info-icon">{isCash ? "⏳" : "✅"}</div>
              <div className="info-content">
                <div className="info-label">{lang === "ta" ? "கட்டண நிலை" : "Payment Status"}</div>
                <div className="info-val">
                  <span className={`success-status-pill ${isCash ? "pending" : "paid"}`}>
                    <i className="status-dot" />
                    {paymentStatusText}
                  </span>
                </div>
                {isCash && (
                  <div className="info-sub text-amber">
                    {lang === "ta" ? "கவுண்டரில் உணவு எடுக்கும்போது ரொக்கம் செலுத்தவும்" : "Pay at counter upon pickup"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items Summary (if available) */}
          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="success-items-section">
              <div className="success-items-title">
                {lang === "ta" ? "ஆர்டர் செய்யப்பட்டவை:" : "Ordered Items:"}
              </div>
              <div className="success-items-tags">
                {order.items.map((it, idx) => (
                  <span key={idx} className="success-item-tag">
                    <strong>{it.qty}×</strong> {lang === "ta" ? (it.name_ta || it.name) : it.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── ACTION BUTTONS ────────────────────────────────────────────── */}
        <div className="success-actions">
          {/* Button 1: Track Order */}
          <button
            type="button"
            className="success-btn-track"
            onClick={() => onNavigate("tracking")}
            id="success-track-btn"
          >
            <TruckIcon size={19} color="#111827" />
            <span>{lang === "ta" ? "ஆர்டரை கண்காணிக்கவும்" : "Track Order"}</span>
            <span className="btn-arrow">→</span>
          </button>

          {/* Button 2: Back to Home */}
          <button
            type="button"
            className="success-btn-home"
            onClick={() => onNavigate("home")}
            id="success-home-btn"
          >
            <HomeIcon size={17} color="#073B30" />
            <span>{lang === "ta" ? "முகப்பு பக்கத்திற்கு செல்ல" : "Back to Home"}</span>
          </button>
        </div>

        {/* Pickup Counter Hint */}
        <div className="success-counter-hint">
          <span>🔔</span>
          <span>
            {lang === "ta"
              ? `கவுண்டர் #${order.counter || 2} இல் உங்கள் டிஜிட்டல் QR டோக்கனை காண்பித்து உணவை பெற்றுக்கொள்ளலாம்.`
              : `Pick up at Counter #${order.counter || 2}. You can show the QR pickup pass from the Track page.`}
          </span>
        </div>
      </div>
    </div>
  );
}
