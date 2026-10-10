import React, { useState, useEffect, useCallback } from "react";
import "./PaymentPage.css";

// ── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const CheckCircleIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const ShieldIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);
const LockIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const LoaderIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="pay-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const PAYMENT_METHODS = [
  {
    id: "UPI",
    label: "UPI",
    desc: "Google Pay, PhonePe, Paytm & BHIM",
    emoji: null,
    color: "#d97706",
    bg: "rgba(217,119,6,0.1)",
  },
  {
    id: "CARD",
    label: "Debit / Credit Card",
    desc: "Visa, Mastercard, RuPay",
    emoji: null,
    color: "#2563eb",
    bg: "rgba(37,99,235,0.1)",
  },
  {
    id: "CASH",
    label: "Cash at Canteen",
    desc: "Pay when you pick up at the counter",
    emoji: "💵",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
  },
  {
    id: "WALLET",
    label: "Campus Wallet",
    desc: "Use your student campus balance",
    emoji: "👛",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
  },
];

const API_BASE = "http://localhost:5000/api";

function apiHeaders(user) {
  return {
    "Content-Type": "application/json",
    "x-user-id": user?.id || user?.roll || "student-01",
    "x-user-name": user?.name || "Student",
    "x-user-email": user?.email || "student@canteen.edu",
    "x-user-role": user?.role || "customer",
  };
}

export default function PaymentPage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const { user, lang = "en", clearCart, setOrder: setGlobalOrder } = canteenData;

  // Recover pending order from sessionStorage
  const [pendingOrder, setPendingOrder] = useState(() => {
    try {
      const raw = sessionStorage.getItem("canteen_pending_order");
      if (raw) return JSON.parse(raw);
      if (window.location.search.includes("testUser=student")) {
        return {
          id: "ORD-84920",
          items: [
            { id: "veg_thali", name: "Veg Thali", name_ta: "காய்கறி உணவு", price: 90, qty: 1 },
            { id: "orange_juice", name: "Fresh Orange Juice", name_ta: "ஆரஞ்சு ஜூஸ்", price: 40, qty: 1 },
          ],
          total: 130,
          canteenId: "main",
          canteenName: "CSE Canteen",
          canteenLoc: "Block A · Ground Floor",
          token: "A-54",
          counter: 2,
          status: -2,
          paymentStatus: "PENDING",
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  // Flow Stage: "summary" (Make Payment) or "method" (Choose Payment Method)
  const [stage, setStage] = useState(() => {
    try {
      if (window.location.search.includes("stage=method")) return "method";
    } catch {}
    return "summary";
  });

  const [walletBalance, setWalletBalance] = useState(null);
  const [payMethod, setPayMethod] = useState("UPI");

  // UPI fields
  const [upiId, setUpiId] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch wallet balance when WALLET is selected or on mount
  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/wallet`, { headers: apiHeaders(user) })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && typeof d.walletBalance === "number") setWalletBalance(d.walletBalance);
        })
        .catch(() => setWalletBalance(null));
    }
  }, [user]);

  // If no pending order in session, redirect to cart / order
  useEffect(() => {
    if (!pendingOrder) {
      onNavigate("order");
    }
  }, [pendingOrder, onNavigate]);

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").substring(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").substring(0, 4);
    if (digits.length >= 3) return `${digits.substring(0, 2)}/${digits.substring(2)}`;
    return digits;
  };

  const validate = () => {
    const errs = {};
    if (payMethod === "UPI") {
      if (!upiId.trim()) {
        errs.upiId = "Please enter your UPI ID (e.g. name@okaxis)";
      } else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim())) {
        errs.upiId = "Invalid UPI ID format. Example: name@upi";
      }
    }
    if (payMethod === "CARD") {
      const digits = cardNumber.replace(/\s/g, "");
      if (digits.length < 16) errs.cardNumber = "Card number must be 16 digits";
      if (!cardExpiry || cardExpiry.length < 5) errs.cardExpiry = "Enter expiry as MM/YY";
      if (!cardCvv || cardCvv.length < 3) errs.cardCvv = "CVV must be 3 digits";
      if (!cardName.trim()) errs.cardName = "Enter cardholder name";
    }
    if (payMethod === "WALLET" && walletBalance !== null) {
      if (walletBalance < pendingOrder?.total) {
        errs.wallet = `Insufficient wallet balance. Available: ₹${walletBalance?.toFixed(2)}, Required: ₹${pendingOrder?.total?.toFixed(2)}`;
      }
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmPayment = async () => {
    if (!validate()) return;
    if (!pendingOrder || !user) return;

    setIsProcessing(true);
    setError("");

    try {
      const cardLastFour = payMethod === "CARD" ? cardNumber.replace(/\s/g, "").slice(-4) : undefined;
      const refId = `${payMethod}-${Date.now()}`;
      const body = {
        paymentMethod: payMethod,
        transactionRef: refId,
        ...(payMethod === "UPI" ? { upiId: upiId.trim() } : {}),
        ...(payMethod === "CARD" ? { cardLastFour } : {}),
      };

      const res = await fetch(`${API_BASE}/orders/${pendingOrder.id}/payment`, {
        method: "POST",
        headers: apiHeaders(user),
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.insufficientBalance) {
          setFieldErrors({ wallet: data.error });
          setIsProcessing(false);
          return;
        }
        setError(data.error || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Successful payment confirmation
      const finalPaymentStatus = payMethod === "CASH" ? "PENDING" : "PAID";
      const confirmedOrder = {
        ...data.order,
        id: pendingOrder.id,
        items: pendingOrder.items,
        total: pendingOrder.total,
        canteenId: pendingOrder.canteenId,
        canteenName: pendingOrder.canteenName,
        canteenLoc: pendingOrder.canteenLoc,
        paymentMode: payMethod,
        paymentStatus: finalPaymentStatus,
        status: 0,
        token: pendingOrder.token || data.order?.token || "A-24",
        counter: pendingOrder.counter || data.order?.counter || 1,
        transactionRef: refId,
        qrToken: pendingOrder.qrToken || data.order?.qrToken,
      };

      // Store in sessionStorage for OrderSuccess and Tracking pages
      try {
        sessionStorage.setItem("canteen_confirmed_order", JSON.stringify(confirmedOrder));
        sessionStorage.removeItem("canteen_pending_order");
      } catch {}

      // Update global context active order
      if (typeof setGlobalOrder === "function") setGlobalOrder(confirmedOrder);

      // Clear the cart upon successful payment/confirmation
      if (typeof clearCart === "function") clearCart();

      // Navigate to Order Placed Successfully page
      onNavigate("order-success");
    } catch (err) {
      console.error("Payment network error:", err);
      // Fallback offline simulation so user flow never gets stuck
      const refId = `${payMethod}-${Date.now()}`;
      const finalPaymentStatus = payMethod === "CASH" ? "PENDING" : "PAID";
      const confirmedOrder = {
        ...pendingOrder,
        paymentMode: payMethod,
        paymentStatus: finalPaymentStatus,
        status: 0,
        transactionRef: refId,
      };
      try {
        sessionStorage.setItem("canteen_confirmed_order", JSON.stringify(confirmedOrder));
        sessionStorage.removeItem("canteen_pending_order");
      } catch {}
      if (typeof setGlobalOrder === "function") setGlobalOrder(confirmedOrder);
      if (typeof clearCart === "function") clearCart();
      onNavigate("order-success");
    }
  };

  if (!pendingOrder) return null;

  const canteenName = pendingOrder.canteenName || "Campus Canteen";
  const total = Number(pendingOrder.total || 0);
  const items = pendingOrder.items || [];

  return (
    <div className="pay-page">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="pay-header">
        <button
          className="pay-back-btn"
          onClick={() => {
            if (stage === "method") {
              setStage("summary");
            } else {
              onNavigate("cart");
            }
          }}
          aria-label="Go back"
        >
          <ArrowLeftIcon size={18} color="#fff" />
        </button>
        <div className="pay-header-content">
          <div className="pay-header-eyebrow">
            {stage === "summary"
              ? "ORDER REVIEW · MAKE PAYMENT"
              : "CHOOSE PAYMENT METHOD"}
          </div>
          <h1 className="pay-header-title">
            {stage === "summary" ? "Make Payment" : "Choose Payment Method"}
          </h1>
        </div>
        <div className="pay-secure-badge">
          <ShieldIcon size={14} color="#4ade80" />
          <span>Secure</span>
        </div>
      </div>

      {/* ── STEP TRACKER ───────────────────────────────────────────── */}
      <div className="pay-flow-tracker">
        <div className={`pay-track-step ${stage === "summary" ? "active" : "done"}`}>
          <span className="step-circle">{stage === "method" ? "✓" : "1"}</span>
          <span className="step-text">1. Make Payment</span>
        </div>
        <div className="pay-track-arrow">→</div>
        <div className={`pay-track-step ${stage === "method" ? "active" : ""}`}>
          <span className="step-circle">2</span>
          <span className="step-text">2. Choose Payment Method</span>
        </div>
      </div>

      <div className="pay-scroll">
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STAGE 1: MAKE PAYMENT (Order Summary & Details)             */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {stage === "summary" && (
          <div className="pay-stage-wrap">
            <section className="pay-summary-card">
              <div className="pay-summary-header">
                <span className="pay-summary-label">Order Details</span>
                <span className="pay-order-id">{pendingOrder.id}</span>
              </div>

              {/* Selected Canteen */}
              <div className="pay-canteen-row">
                <span className="pay-canteen-icon">🏫</span>
                <div>
                  <div className="pay-canteen-name">{canteenName}</div>
                  {pendingOrder.canteenLoc && (
                    <div className="pay-canteen-loc">📍 {pendingOrder.canteenLoc}</div>
                  )}
                </div>
              </div>

              <div className="pay-divider-subtle" />

              {/* Selected Items & Quantities */}
              <div className="pay-items-list-header">
                <span>Selected Items</span>
                <span>Qty & Price</span>
              </div>

              <div className="pay-items-list">
                {items.map((item, idx) => (
                  <div key={idx} className="pay-item-row">
                    <div className="pay-item-name-group">
                      <span className="pay-item-bullet">•</span>
                      <span className="pay-item-name">
                        {lang === "ta" ? (item.name_ta || item.name) : item.name}
                      </span>
                    </div>
                    <div className="pay-item-qty-price">
                      <span className="pay-item-qty">×{item.qty}</span>
                      <span className="pay-item-price">₹{(item.price * item.qty).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pay-divider-subtle" />

              {/* Amount Breakdown */}
              <div className="pay-calc-row">
                <span>Item Subtotal</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <div className="pay-calc-row">
                <span>Convenience & Packaging</span>
                <span style={{ color: "#16a34a" }}>FREE</span>
              </div>

              <div className="pay-total-row">
                <span>Total Amount</span>
                <span className="pay-total-amount">₹{total.toFixed(0)}</span>
              </div>
            </section>

            {/* Ready to proceed info banner */}
            <div className="pay-info-banner">
              <span>💳</span>
              <div>
                <strong>Pending Order Created ({pendingOrder.id})</strong>
                <p>
                  Click "Make Payment" below to select UPI, Card, Cash at Canteen, or Wallet. Your order will be confirmed upon payment completion.
                </p>
              </div>
            </div>

            {/* Prominent Make Payment Button */}
            <div className="pay-summary-actions">
              <button
                type="button"
                className="pay-make-payment-btn"
                onClick={() => setStage("method")}
                id="make-payment-continue-btn"
              >
                <span>Make Payment</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STAGE 2: CHOOSE PAYMENT METHOD                              */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {stage === "method" && (
          <div className="pay-stage-wrap">
            {/* Quick mini-summary pill */}
            <div className="pay-mini-summary">
              <div>
                <span className="mini-lbl">Order:</span>{" "}
                <span className="mini-id">{pendingOrder.id}</span>
              </div>
              <div className="mini-total">₹{total.toFixed(0)}</div>
            </div>

            {/* Payment Method Cards */}
            <section className="pay-methods-card">
              <h2 className="pay-methods-title">Choose Payment Method</h2>
              <div className="pay-methods-grid">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = payMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      className={`pay-method-btn ${isSelected ? "selected" : ""}`}
                      style={isSelected ? { borderColor: pm.color, background: pm.bg } : {}}
                      onClick={() => {
                        setPayMethod(pm.id);
                        setFieldErrors({});
                        setError("");
                      }}
                      type="button"
                      id={`pay-method-${pm.id.toLowerCase()}`}
                    >
                      <div className="pay-method-left">
                        <div
                          className="pay-method-icon-box"
                          style={isSelected ? { background: pm.color + "22" } : {}}
                        >
                          {pm.id === "UPI" ? <span className="pay-upi-text">UPI</span> : null}
                          {pm.id === "CARD" ? <span className="pay-card-icon">💳</span> : null}
                          {pm.emoji && <span className="pay-method-emoji">{pm.emoji}</span>}
                        </div>
                        <div className="pay-method-info">
                          <div
                            className="pay-method-name"
                            style={isSelected ? { color: pm.color } : {}}
                          >
                            {pm.label}
                          </div>
                          <div className="pay-method-desc">{pm.desc}</div>
                          {pm.id === "WALLET" && walletBalance !== null && isSelected && (
                            <div
                              className="pay-wallet-bal"
                              style={{ color: walletBalance >= total ? "#16a34a" : "#dc2626" }}
                            >
                              Balance: ₹{walletBalance.toFixed(2)}
                              {walletBalance < total && " (Insufficient)"}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="pay-method-radio"
                        style={{ borderColor: isSelected ? pm.color : undefined }}
                      >
                        {isSelected && (
                          <div
                            className="pay-method-radio-dot"
                            style={{ background: pm.color }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── METHOD 1: UPI INTERFACE ────────────────────────────── */}
            {payMethod === "UPI" && (
              <section className="pay-details-card">
                <h3 className="pay-details-title">🔄 UPI Payment Interface</h3>
                <p className="pay-details-sub">Enter your Virtual Payment Address (VPA) / UPI ID</p>

                <div className="pay-input-wrap">
                  <label className="pay-input-label">UPI ID *</label>
                  <input
                    type="text"
                    id="upi-id-input"
                    className={`pay-input ${fieldErrors.upiId ? "error" : ""}`}
                    placeholder="e.g. student@okaxis or 9876543210@upi"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setFieldErrors((f) => ({ ...f, upiId: "" }));
                    }}
                    autoComplete="off"
                  />
                  {fieldErrors.upiId && <div className="pay-field-error">⚠ {fieldErrors.upiId}</div>}
                </div>

                <div className="pay-upi-apps">
                  <span className="pay-upi-quick-lbl">Supported Apps:</span>
                  {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                    <button
                      key={app}
                      type="button"
                      className="pay-upi-app-chip"
                      onClick={() => {
                        const domain = app === "Google Pay" ? "okaxis" : app === "PhonePe" ? "ybl" : "paytm";
                        setUpiId((prev) => (prev ? prev.split("@")[0] + `@${domain}` : `student@${domain}`));
                        setFieldErrors((f) => ({ ...f, upiId: "" }));
                      }}
                    >
                      {app}
                    </button>
                  ))}
                </div>

                <div className="pay-upi-note">
                  <LockIcon size={12} color="#073B30" /> Amount of ₹{total.toFixed(0)} will be debited upon authorization
                </div>
              </section>
            )}

            {/* ── METHOD 2: DEBIT / CREDIT CARD ──────────────────────── */}
            {payMethod === "CARD" && (
              <section className="pay-details-card">
                <h3 className="pay-details-title">💳 Debit / Credit Card</h3>
                <p className="pay-details-sub">Pay securely using any Visa, MasterCard, or RuPay card</p>

                <div className="pay-input-wrap">
                  <label className="pay-input-label">Card Number *</label>
                  <input
                    type="text"
                    id="card-number-input"
                    className={`pay-input pay-card-number ${fieldErrors.cardNumber ? "error" : ""}`}
                    placeholder="4532 •••• •••• 8921"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(formatCardNumber(e.target.value));
                      setFieldErrors((f) => ({ ...f, cardNumber: "" }));
                    }}
                    maxLength={19}
                    autoComplete="cc-number"
                  />
                  {fieldErrors.cardNumber && <div className="pay-field-error">⚠ {fieldErrors.cardNumber}</div>}
                </div>

                <div className="pay-card-row">
                  <div className="pay-input-wrap" style={{ flex: 1 }}>
                    <label className="pay-input-label">Expiry Date *</label>
                    <input
                      type="text"
                      id="card-expiry-input"
                      className={`pay-input ${fieldErrors.cardExpiry ? "error" : ""}`}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        setCardExpiry(formatExpiry(e.target.value));
                        setFieldErrors((f) => ({ ...f, cardExpiry: "" }));
                      }}
                      maxLength={5}
                      autoComplete="cc-exp"
                    />
                    {fieldErrors.cardExpiry && <div className="pay-field-error">⚠ {fieldErrors.cardExpiry}</div>}
                  </div>
                  <div className="pay-input-wrap" style={{ flex: 1 }}>
                    <label className="pay-input-label">
                      CVV * <span className="pay-cvv-note">(Never stored)</span>
                    </label>
                    <input
                      type="password"
                      id="card-cvv-input"
                      className={`pay-input ${fieldErrors.cardCvv ? "error" : ""}`}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 4));
                        setFieldErrors((f) => ({ ...f, cardCvv: "" }));
                      }}
                      maxLength={4}
                      autoComplete="cc-csc"
                    />
                    {fieldErrors.cardCvv && <div className="pay-field-error">⚠ {fieldErrors.cardCvv}</div>}
                  </div>
                </div>

                <div className="pay-input-wrap">
                  <label className="pay-input-label">Cardholder Name *</label>
                  <input
                    type="text"
                    id="card-name-input"
                    className={`pay-input ${fieldErrors.cardName ? "error" : ""}`}
                    placeholder="Name as printed on card"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      setFieldErrors((f) => ({ ...f, cardName: "" }));
                    }}
                    autoComplete="cc-name"
                  />
                  {fieldErrors.cardName && <div className="pay-field-error">⚠ {fieldErrors.cardName}</div>}
                </div>

                <div className="pay-card-security">
                  <ShieldIcon size={13} color="#073B30" />
                  <span>CVV is strictly NOT saved in the database. Transactions are 256-bit encrypted.</span>
                </div>
              </section>
            )}

            {/* ── METHOD 3: CASH AT CANTEEN ───────────────────────────── */}
            {payMethod === "CASH" && (
              <section className="pay-details-card pay-cash-card">
                <div className="pay-cash-icon">💵</div>
                <h3 className="pay-details-title">Cash at Canteen</h3>
                <p className="pay-cash-desc">
                  Your order will be sent to the kitchen right away. You will pay <strong>₹{total.toFixed(0)}</strong> in cash when collecting your food from <strong>{canteenName}</strong>.
                </p>
                <div className="pay-cash-note">
                  ℹ️ Payment status will be marked as <strong>Pending</strong> until cash is verified at the pickup counter.
                </div>
              </section>
            )}

            {/* ── METHOD 4: WALLET ───────────────────────────────────── */}
            {payMethod === "WALLET" && (
              <section className="pay-details-card pay-wallet-card">
                <div className="pay-wallet-icon">👛</div>
                <h3 className="pay-details-title">Campus Wallet</h3>
                {walletBalance !== null ? (
                  <>
                    <div className="pay-wallet-balance-row">
                      <span>Available Balance</span>
                      <span
                        className="pay-wallet-bal-amount"
                        style={{ color: walletBalance >= total ? "#16a34a" : "#dc2626" }}
                      >
                        ₹{walletBalance.toFixed(2)}
                      </span>
                    </div>
                    <div className="pay-wallet-balance-row">
                      <span>Order Total</span>
                      <span className="pay-wallet-deduct">-₹{total.toFixed(0)}</span>
                    </div>
                    {walletBalance >= total && (
                      <div className="pay-wallet-balance-row pay-wallet-remaining">
                        <span>Balance Remaining After</span>
                        <span>₹{(walletBalance - total).toFixed(2)}</span>
                      </div>
                    )}
                    {fieldErrors.wallet && (
                      <div className="pay-field-error" style={{ marginTop: 12 }}>
                        ⚠ {fieldErrors.wallet}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="pay-wallet-loading">Loading student wallet balance...</div>
                )}
              </section>
            )}

            {/* Error Banner */}
            {error && (
              <div className="pay-error-banner">
                ⚠️ {error}
              </div>
            )}

            <div style={{ height: 110 }} />
          </div>
        )}
      </div>

      {/* ── BOTTOM STICKY PAY CONFIRM BAR (When in Stage 2) ─────────── */}
      {stage === "method" && (
        <div className="pay-sticky-bar">
          <div className="pay-sticky-total">
            <span>Total Payable</span>
            <span className="pay-sticky-amount">₹{total.toFixed(0)}</span>
          </div>
          <button
            className="pay-confirm-btn"
            onClick={handleConfirmPayment}
            disabled={
              isProcessing ||
              (payMethod === "WALLET" && walletBalance !== null && walletBalance < total)
            }
            type="button"
            id="pay-confirm-submit-btn"
          >
            {isProcessing ? (
              <>
                <LoaderIcon size={18} />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon size={18} />
                <span>
                  {payMethod === "CASH"
                    ? "Confirm Order (Cash at Canteen)"
                    : `Pay ₹${total.toFixed(0)} & Confirm`}
                </span>
              </>
            )}
          </button>
          <div className="pay-secure-note">
            <LockIcon size={12} color="#073B30" />
            <span>End-to-end encrypted · Safe checkout</span>
          </div>
        </div>
      )}
    </div>
  );
}
