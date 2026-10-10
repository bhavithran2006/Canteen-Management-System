import React, { useState, useEffect } from "react";
import RefactoredHeroBanner from "./RefactoredHeroBanner.jsx";
import QrPickupPassCard from "./QrPickupPassCard.jsx";
import trackingBannerImg from "../assets/tracking-hero-banner.png";
import "./RefactoredTrackingPage.css";

// ── Icons ────────────────────────────────────────────────────────────────────
const ClockIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CounterIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h8M6 16h12" />
  </svg>
);

const FlagIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const ReceiptIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </svg>
);

const StoreIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
  </svg>
);

const BellIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const RefreshIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

const CloseIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const STEPS = [
  { id: 0, label: "CONFIRMED", labelTa: "உறுதிப்படுத்தப்பட்டது" },
  { id: 1, label: "PREPARING", labelTa: "தயாராகிறது" },
  { id: 2, label: "READY FOR PICKUP", labelTa: "பெற தயார்" },
  { id: 3, label: "PICKED UP", labelTa: "பெறப்பட்டது" },
];

export default function RefactoredTrackingPage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    order: activeOrder,
    advanceOrderStatus,
    cancelOrder,
    lang = "en",
    user,
  } = canteenData;

  // Local fallback / session recovery
  const [sessionOrder, setSessionOrder] = useState(() => {
    try {
      const raw = sessionStorage.getItem("canteen_confirmed_order");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [localStep, setLocalStep] = useState(() => {
    if (activeOrder?.status !== undefined) return activeOrder.status;
    if (sessionOrder?.status !== undefined) return sessionOrder.status;
    return 0;
  });

  const [notify, setNotify] = useState(true);

  // Poll backend for active order on mount
  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/api/orders/active", {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id || user.roll || "student-01",
          "x-user-role": user.role || "customer",
        },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && d.id) {
            setSessionOrder(d);
            setLocalStep(d.status);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Combine data sources
  const baseOrder = activeOrder || sessionOrder || {
    id: "ORD-1577",
    token: "A-54",
    counter: 2,
    issuedTime: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    paymentMode: "UPI",
    paymentStatus: "PAID",
    status: 0,
    canteenName: "CSE Canteen",
    canteenLoc: "Block A · Ground Floor",
    items: [
      {
        id: "veg_thali",
        name: "Veg Thali",
        name_ta: "காய்கறி உணவு",
        qty: 1,
        price: 90,
      },
    ],
    total: 90,
  };

  const currentStatus = activeOrder?.status !== undefined ? activeOrder.status : localStep;
  const displayOrder = { ...baseOrder, status: currentStatus };

  // Calculate estimated waiting time
  const estimatedWait = (() => {
    if (currentStatus === 0) return "10 - 15 mins";
    if (currentStatus === 1) return "5 - 8 mins";
    if (currentStatus === 2) return lang === "ta" ? "இப்போது தயார்! கவுண்டரில் எடுக்கவும்" : "Ready Now! Collect at Counter";
    return lang === "ta" ? "உணவு பெறப்பட்டது" : "Collected & Completed";
  })();

  const handleSimulate = () => {
    if (activeOrder && advanceOrderStatus) {
      advanceOrderStatus();
    } else {
      setLocalStep((prev) => (prev + 1) % 4);
    }
  };

  const handleCancel = () => {
    if (window.confirm(lang === "ta" ? "இந்த ஆர்டரை ரத்துசெய்யவா?" : "Cancel this order?")) {
      if (cancelOrder) cancelOrder();
      try {
        sessionStorage.removeItem("canteen_confirmed_order");
      } catch {}
      onNavigate("home");
    }
  };

  const isCash =
    displayOrder.paymentMode === "CASH" ||
    displayOrder.paymentStatus === "PENDING" ||
    displayOrder.paymentStatus === "Pending";

  const paymentStatusLabel = isCash
    ? (lang === "ta" ? "நிலுவையில் (கவுண்டரில் செலுத்தவும்)" : "Pending (Cash at Canteen)")
    : (lang === "ta" ? "செலுத்தப்பட்டது" : "Paid");

  return (
    <div className="ref-track-container">
      {/* ── 1. HERO BANNER ────────────────────────────────────────────── */}
      <div className="ref-track-hero-wrap">
        <RefactoredHeroBanner
          label={lang === "ta" ? "ஆர்டர் கண்காணிப்பு" : "ORDER TRACKING"}
          title={lang === "ta" ? "நேரலை கண்காணிப்பு" : "Live Order Tracking"}
          subtitle={lang === "ta" ? "நேரலையில் உங்கள் உணவை கண்காணிக்கவும்" : "Track your campus order from kitchen to pickup"}
          bgImage={trackingBannerImg}
        />
        <div className="ref-track-hero-meta">
          <span className="ref-track-order-badge">
            {displayOrder.id} · Counter #{displayOrder.counter || 2}
          </span>
        </div>
      </div>

      {/* ── 2. CARD 1: YOUR PICKUP TOKEN ──────────────────────────────── */}
      <section className="ref-track-token-card">
        <div className="ref-track-token-eyebrow">
          {lang === "ta" ? "உங்கள் டோக்கன் எண்" : "YOUR PICKUP TOKEN"}
        </div>

        {/* Notched Golden Yellow Ticket matching Mockup */}
        <div className="ref-track-token-ticket">
          <span className="ref-ticket-notch notch-left" />
          <span className="ref-ticket-number">{displayOrder.token}</span>
          <span className="ref-ticket-notch notch-right" />
        </div>

        {/* 4-Column Metadata Row */}
        <div className="ref-track-meta-row">
          <div className="ref-track-meta-col">
            <div className="ref-track-meta-icon-box">
              <ClockIcon size={14} color="#073B30" />
            </div>
            <div className="ref-track-meta-text">
              <span className="ref-track-meta-label">{lang === "ta" ? "காத்திருப்பு" : "Est. Wait"}</span>
              <span className="ref-track-meta-val" style={{ color: currentStatus === 2 ? "#16a34a" : undefined }}>
                {estimatedWait}
              </span>
            </div>
          </div>

          <div className="ref-track-meta-divider" />

          <div className="ref-track-meta-col">
            <div className="ref-track-meta-icon-box">
              <CounterIcon size={14} color="#073B30" />
            </div>
            <div className="ref-track-meta-text">
              <span className="ref-track-meta-label">{lang === "ta" ? "கவுண்டர்" : "Counter"}</span>
              <span className="ref-track-meta-val">#{displayOrder.counter || 2}</span>
            </div>
          </div>

          <div className="ref-track-meta-divider" />

          <div className="ref-track-meta-col">
            <div className="ref-track-meta-icon-box">
              <StoreIcon size={14} color="#073B30" />
            </div>
            <div className="ref-track-meta-text">
              <span className="ref-track-meta-label">{lang === "ta" ? "உணவகம்" : "Canteen"}</span>
              <span className="ref-track-meta-val">{displayOrder.canteenName || "CSE Canteen"}</span>
            </div>
          </div>

          <div className="ref-track-meta-divider" />

          <div className="ref-track-meta-col">
            <div className="ref-track-meta-icon-box">
              <FlagIcon size={14} color="#073B30" />
            </div>
            <div className="ref-track-meta-text">
              <span className="ref-track-meta-label">{lang === "ta" ? "கட்டணம்" : "Payment"}</span>
              <span className="ref-track-meta-val" style={{ color: isCash ? "#d97706" : "#16a34a" }}>
                {paymentStatusLabel}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CARD 2: STEPPER / PROGRESS TIMELINE ────────────────────── */}
      <section className="ref-track-stepper-card">
        <div className="ref-track-stepper-row">
          {STEPS.map((step, idx) => {
            const isDone = currentStatus >= step.id;
            const isCurrent = currentStatus === step.id;

            return (
              <React.Fragment key={step.id}>
                <div className={`ref-track-step ${isDone ? "is-active" : ""}`}>
                  <div className={`ref-track-step-circle ${isDone ? "done" : ""}`}>
                    {step.id + 1}
                  </div>
                  <span className={`ref-track-step-lbl ${isCurrent ? "current" : ""}`}>
                    {lang === "ta" ? step.labelTa : step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="ref-track-step-line">
                    <div
                      className="ref-track-step-line-fill"
                      style={{
                        width:
                          currentStatus > step.id
                            ? "100%"
                            : currentStatus === step.id
                            ? "50%"
                            : "0%",
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Simulate Next Update Button */}
        <button
          type="button"
          className="ref-track-simulate-btn"
          onClick={handleSimulate}
          id="simulate-order-status-btn"
        >
          <RefreshIcon size={15} color="#ffffff" />
          <span>{lang === "ta" ? "அடுத்த நிலையை சோதிக்க →" : "Simulate next update →"}</span>
        </button>
      </section>

      {/* ── 4. QR PICKUP PASS CARD ────────────────────────────────────── */}
      <section style={{ margin: "20px 0" }}>
        <QrPickupPassCard
          order={displayOrder}
          lang={lang}
        />
      </section>

      {/* ── 5. SECTION: ORDER SUMMARY & ORDERED ITEMS ─────────────────── */}
      <div className="ref-track-summary-head">
        <ReceiptIcon size={16} color="#111827" />
        <span>{lang === "ta" ? "ஆர்டர் செய்யப்பட்ட உணவுகள்" : "ORDERED ITEMS & SUMMARY"}</span>
      </div>

      <section className="ref-track-summary-card" style={{ flexDirection: "column", padding: "18px 22px" }}>
        {/* Ordered items breakdown */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {(displayOrder.items || []).map((it, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: idx < (displayOrder.items || []).length - 1 ? "1px solid rgba(7,59,48,0.06)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  background: "#F5B800",
                  color: "#111827",
                  fontSize: 11.5,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 6,
                }}>
                  {it.qty}×
                </span>
                <span style={{ fontWeight: 700, fontSize: 14.5, color: "#111827" }}>
                  {lang === "ta" ? (it.name_ta || it.name) : it.name}
                </span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 14.5, color: "#073B30" }}>
                ₹{(it.price * it.qty).toFixed(0)}
              </span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(7,59,48,0.1)", margin: "14px 0" }} />

        {/* Canteen & Payment details summary */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          width: "100%",
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted, #64748b)", textTransform: "uppercase" }}>
              {lang === "ta" ? "உணவகம்" : "Canteen"}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginTop: 2 }}>
              {displayOrder.canteenName || "CSE Canteen"}
            </div>
            {displayOrder.canteenLoc && (
              <div style={{ fontSize: 11, color: "var(--text-muted, #64748b)" }}>
                📍 {displayOrder.canteenLoc}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted, #64748b)", textTransform: "uppercase" }}>
              {lang === "ta" ? "கட்டண முறை" : "Payment Mode"}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginTop: 2 }}>
              {displayOrder.paymentMode || "UPI"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted, #64748b)", textTransform: "uppercase" }}>
              {lang === "ta" ? "கட்டண நிலை" : "Payment Status"}
            </div>
            <div style={{
              fontSize: 12,
              fontWeight: 800,
              color: isCash ? "#b45309" : "#047857",
              background: isCash ? "rgba(245,184,0,0.15)" : "rgba(16,185,129,0.15)",
              padding: "2px 8px",
              borderRadius: 8,
              display: "inline-block",
              marginTop: 2,
            }}>
              {displayOrder.paymentStatus || "PAID"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted, #64748b)", textTransform: "uppercase" }}>
              {lang === "ta" ? "மொத்த தொகை" : "Total Amount"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#073B30", marginTop: 2 }}>
              ₹{Number(displayOrder.total || 0).toFixed(0)}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CARD 4: PUSH NOTIFICATION TOGGLE ───────────────────────── */}
      <section className="ref-track-notify-card">
        <div className="ref-track-notify-left">
          <div className="ref-track-notify-icon-box">
            <BellIcon size={16} color="#073B30" />
          </div>
          <div>
            <h4 className="ref-track-notify-title">
              {lang === "ta" ? "தயாரானதும் அறிவிக்கவும்" : "Notify when ready"}
            </h4>
            <p className="ref-track-notify-desc">
              {lang === "ta" ? "புஷ் அறிவிப்பு + கவுண்டர் காட்சி" : "Push alert + counter display"}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          className={`ref-track-switch ${notify ? "is-on" : ""}`}
          onClick={() => setNotify((prev) => !prev)}
          aria-label="Toggle notifications"
        >
          <span className="ref-track-switch-knob" />
        </button>
      </section>

      {/* ── 7. CANCEL ORDER / BACK ACTIONS ────────────────────────────── */}
      <div className="ref-track-cancel-wrap">
        <button
          type="button"
          className="ref-track-cancel-btn"
          onClick={handleCancel}
        >
          <CloseIcon size={13} color="#dc2626" />
          <span>{lang === "ta" ? "ஆர்டரை ரத்துசெய்" : "Cancel order"}</span>
        </button>
      </div>
    </div>
  );
}
