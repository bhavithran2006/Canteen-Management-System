import React, { useState, useMemo } from "react";
import RefactoredHeroBanner from "./RefactoredHeroBanner.jsx";
import cartBannerImg from "../assets/cart-hero-banner.png";
import vegThaliImg from "../assets/dish_veg_thali.jpg";
import chickenBiryaniImg from "../assets/dish_chicken_biryani.jpg";
import orangeJuiceImg from "../assets/dish_orange_juice.jpg";
import mangoJuiceImg from "../assets/dish_mango_juice.jpg";
import watermelonJuiceImg from "../assets/dish_watermelon_juice.jpg";
import limeMintImg from "../assets/dish_lime_mint.jpg";
import "./RefactoredCartPage.css";

// ── Icons ────────────────────────────────────────────────────────────────────
const MinusIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const TicketIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2M13 11v2M13 17v2" />
  </svg>
);

const CreditCardIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const ShieldCheckIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CartIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const LeafIcon = ({ size = 11, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </svg>
);

export default function RefactoredCartPage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    user,
    cart = {},
    cartLines = [],
    cartTotal = 0,
    addToCart,
    setQty,
    menu = [],
    lang = "en",
    showAlert,
    canteens = [],
    selectedCanteen,
    t = (k) => k,
  } = canteenData;

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [payMode, setPayMode] = useState("UPI");
  const [selectedCanteenId, setSelectedCanteenId] = useState(selectedCanteen || "main");
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Calculate pricing
  const discount = couponApplied ? Math.round(cartTotal * 0.1) : 0;
  const totalAmount = Math.max(0, cartTotal - discount);

  // Cart status
  const hasItems = cartLines.length > 0;

  // Handle promo code
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "CANTEEN10") {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponApplied(false);
      setCouponError(true);
    }
  };

  // Helper for item images
  const getDishImage = (item) => {
    if (item.id === "veg_thali" || item.category === "meals") return vegThaliImg;
    if (item.id === "chicken_biryani") return chickenBiryaniImg;
    if (item.id === "orange_juice") return orangeJuiceImg;
    if (item.id === "mango_juice") return mangoJuiceImg;
    if (item.id === "watermelon_juice") return watermelonJuiceImg;
    if (item.id === "lime_mint") return limeMintImg;
    if (item.category === "juice") return orangeJuiceImg;
    return vegThaliImg;
  };

  // Juices for "Pair with Fresh Juice!" row
  const JUICE_RECOMMENDATIONS = [
    {
      id: "orange_juice",
      name: "Fresh Orange Juice",
      nameTa: "ஆரஞ்சு ஜூஸ்",
      price: 40,
      img: orangeJuiceImg,
    },
    {
      id: "mango_juice",
      name: "Mango Juice",
      nameTa: "மாம்பழ ஜூஸ்",
      price: 50,
      img: mangoJuiceImg,
    },
    {
      id: "watermelon_juice",
      name: "Watermelon Juice",
      nameTa: "தர்பூசணி ஜூஸ்",
      price: 35,
      img: watermelonJuiceImg,
    },
    {
      id: "lime_mint",
      name: "Lime Mint Cooler",
      nameTa: "எலுமிச்சை புதினா ஜூஸ்",
      price: 30,
      img: limeMintImg,
    },
  ];

  // Available campus canteens fallback
  const CANTEEN_LIST = canteens.length > 0 ? canteens : [
    { id: "main", name: "CSE Canteen", loc: "Block A · Ground Floor", level: "low", status: "active" },
    { id: "hostel", name: "S&H Canteen", loc: "Block D", level: "med", status: "active" },
    { id: "library", name: "Mech Canteen", loc: "Block C · 1st Floor", level: "low", status: "active" },
  ];

  // ── Place Order Validation & Backend Pending Order Creation ──
  const handlePlaceOrder = async () => {
    // 1. Validate: User must be logged in
    if (!user) {
      const msg = lang === "ta" ? "ஆர்டர் செய்ய முதலில் உள்நுழையவும்." : "Please log in before placing an order.";
      if (showAlert) showAlert(msg);
      onNavigate("login");
      return;
    }

    // 2. Validate: Cart must not be empty
    if (!hasItems || cartLines.length === 0) {
      const msg = lang === "ta" ? "உங்கள் கூடை காலியாக உள்ளது." : "Your cart is empty.";
      setOrderError(msg);
      if (showAlert) showAlert(msg);
      return;
    }

    // 3. Validate: All selected items must be currently available
    for (const item of cartLines) {
      const menuItem = (menu || []).find((m) => m.id === item.id);
      if (menuItem) {
        if (menuItem.available === false || (menuItem.stock !== undefined && menuItem.stock < item.qty)) {
          const msg = lang === "ta"
            ? `"${menuItem.name_ta || menuItem.name}" போதுமான இருப்பு இல்லை அல்லது தற்போது கிடைக்கவில்லை.`
            : `"${menuItem.name}" is currently unavailable or has insufficient stock.`;
          setOrderError(msg);
          if (showAlert) showAlert(msg);
          return;
        }
      }
    }

    // 4. Validate: Canteen must be active
    const chosenCanteen = CANTEEN_LIST.find((c) => c.id === selectedCanteenId) || CANTEEN_LIST[0];
    if (chosenCanteen && chosenCanteen.status === "inactive") {
      const msg = lang === "ta"
        ? "இந்த உணவகம் தற்போது செயல்படவில்லை. தயவுசெய்து மற்றொரு உணவகத்தை தேர்வு செய்யவும்."
        : "This canteen is currently inactive. Please choose another canteen.";
      setOrderError(msg);
      if (showAlert) showAlert(msg);
      return;
    }

    setIsPlacing(true);
    setOrderError("");

    try {
      // 5. Create pending order in backend
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id || user.roll || "student-01",
          "x-user-name": user.name || "Student",
          "x-user-email": user.email || "student@canteen.edu",
          "x-user-role": user.role || "customer",
        },
        body: JSON.stringify({
          items: cartLines.map((c) => ({ id: c.id, qty: c.qty })),
          canteenId: chosenCanteen.id,
          paymentMode: payMode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOrderError(data.message || data.error || "Failed to create order. Please try again.");
        setIsPlacing(false);
        return;
      }

      // Store created pending order with unique Order ID in sessionStorage
      sessionStorage.setItem("canteen_pending_order", JSON.stringify(data));
      setIsPlacing(false);

      // Navigate to Make Payment page
      onNavigate("payment");
    } catch (err) {
      console.warn("Backend orders API unreachable, generating pending order fallback:", err);
      // Offline / network fallback with unique Order ID
      const fallbackOrder = {
        id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
        items: cartLines,
        total: totalAmount,
        canteenId: chosenCanteen.id,
        canteenName: chosenCanteen.name,
        canteenLoc: chosenCanteen.loc,
        paymentMode: payMode,
        paymentStatus: "PENDING",
        status: -2, // -2 = Awaiting Payment
        token: "A-" + (10 + Math.floor(Math.random() * 89)),
        counter: 2,
        issuedTime: new Date().toISOString(),
      };
      sessionStorage.setItem("canteen_pending_order", JSON.stringify(fallbackOrder));
      setIsPlacing(false);
      onNavigate("payment");
    }
  };

  return (
    <div className="ref-cart-container">
      {/* ── 1. HERO BANNER ────────────────────────────────────────────── */}
      <RefactoredHeroBanner
        label={lang === "ta" ? "வளாக உணவகம்" : "CAMPUS CANTEEN"}
        title={lang === "ta" ? "உங்கள் கூடை" : "Your cart"}
        subtitle={lang === "ta" ? "மதிப்பாய்வு மற்றும் உணவகத் தேர்வு" : "Review & select canteen"}
        bgImage={cartBannerImg}
      />

      {/* ── 2. CART ITEMS LIST ────────────────────────────────────────── */}
      {hasItems ? (
        <section className="ref-cart-items-list">
          {cartLines.map((item) => {
            const isVeg = item.dietTag === "veg" || item.category !== "non-veg";
            const itemName = lang === "ta" ? (item.name_ta || item.name) : item.name;
            const imgSrc = getDishImage(item);
            const itemDescription = item.id === "veg_thali"
              ? "Rice, Sambar, Rasam, Poriyal, Chapati, Curd"
              : item.desc || (lang === "ta" ? "புதிய மற்றும் சுவையான வளாக உணவு" : "Freshly prepared campus dish");

            return (
              <div key={item.id} className="ref-cart-item-card">
                <div className="ref-cart-item-left">
                  <img
                    src={imgSrc}
                    alt={itemName}
                    className="ref-cart-dish-thumb"
                  />
                  <div className="ref-cart-dish-info">
                    <div className="ref-cart-title-row">
                      <h2 className="ref-cart-dish-name">{itemName}</h2>
                      <span className={isVeg ? "ref-cart-veg-badge" : "ref-cart-nonveg-badge"}>
                        {isVeg && <LeafIcon size={11} color="currentColor" />}
                        <span>{isVeg ? "Vegetarian" : "Non-Veg"}</span>
                      </span>
                    </div>
                    <p className="ref-cart-dish-desc">{itemDescription}</p>
                  </div>
                </div>

                <div className="ref-cart-item-right">
                  {/* Stepper */}
                  <div className="ref-cart-stepper">
                    <button
                      type="button"
                      className="ref-cart-step-btn"
                      onClick={() => setQty(item.id, Math.max(0, item.qty - 1))}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon size={12} />
                    </button>
                    <span className="ref-cart-step-qty">{item.qty}</span>
                    <button
                      type="button"
                      className="ref-cart-step-btn"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon size={12} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="ref-cart-dish-price">
                    ₹{item.price * item.qty}
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="ref-cart-delete-btn"
                    onClick={() => setQty(item.id, 0)}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <TrashIcon size={18} color="#ef4444" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="ref-cart-item-card" style={{ padding: "36px 20px", textAlign: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🛒</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>
            {lang === "ta" ? "உங்கள் கூடை காலியாக உள்ளது" : "Your cart is empty"}
          </h3>
          <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>
            {lang === "ta" ? "சுவையான உணவுகளை ஆர்டர் செய்ய மெனுவை உலாவவும்" : "Browse our fresh menu and add your favorite dishes!"}
          </p>
          <button
            type="button"
            className="ref-choose-btn"
            style={{ width: "auto", padding: "10px 24px", margin: "0 auto" }}
            onClick={() => onNavigate("order")}
          >
            <span>{lang === "ta" ? "உணவுகளை ஆர்டர் செய்" : "Order Food"}</span>
            <span>→</span>
          </button>
        </section>
      )}

      {/* ── 3. PAIR WITH FRESH JUICE! SECTION ─────────────────────────── */}
      <section className="ref-juice-section">
        <div className="ref-juice-header">
          <div className="ref-juice-icon-circle">
            🥤
          </div>
          <div className="ref-juice-header-info">
            <h3>Pair with Fresh Juice! 🧃</h3>
            <p>Freshly squeezed & chilled drinks to complement your food</p>
          </div>
        </div>

        <div className="ref-juice-cards-grid">
          {JUICE_RECOMMENDATIONS.map((juice) => (
            <div key={juice.id} className="ref-juice-item-card">
              <div className="ref-juice-card-left">
                <img
                  src={juice.img}
                  alt={juice.name}
                  className="ref-juice-thumb"
                />
                <div>
                  <h4 className="ref-juice-name">
                    {lang === "ta" ? juice.nameTa : juice.name}
                  </h4>
                  <div className="ref-juice-price">₹{juice.price}</div>
                </div>
              </div>

              <button
                type="button"
                className="ref-juice-add-btn"
                onClick={() => addToCart(juice.id, 1)}
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. PICKUP CANTEEN SELECTION ───────────────────────────────── */}
      <section className="ref-promo-card">
        <div className="ref-promo-label">
          <span style={{ fontSize: 16 }}>🏫</span>
          <span>SELECT PICKUP CANTEEN</span>
        </div>
        <p style={{ margin: "2px 0 12px", fontSize: 12.5, color: "var(--text-muted, #64748B)" }}>
          {lang === "ta" ? "உங்கள் உணவு தயாராகும் உணவகத்தைத் தேர்ந்தெடுக்கவும்:" : "Choose where your food will be freshly prepared & picked up:"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {CANTEEN_LIST.map((c) => {
            const isInactive = c.status === "inactive";
            const isSel = selectedCanteenId === c.id && !isInactive;
            return (
              <button
                key={c.id}
                type="button"
                id={`canteen-choice-${c.id}`}
                disabled={isInactive}
                onClick={() => {
                  if (isInactive) return;
                  setSelectedCanteenId(c.id);
                  setOrderError("");
                }}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: isInactive
                    ? "1.5px dashed rgba(239,68,68,0.4)"
                    : isSel
                    ? "2px solid #073B30"
                    : "1.5px solid rgba(7,59,48,0.14)",
                  background: isInactive
                    ? "rgba(241, 245, 249, 0.7)"
                    : isSel
                    ? "rgba(7,59,48,0.06)"
                    : "var(--surface, #FFFFFF)",
                  cursor: isInactive ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: isSel ? "0 4px 12px rgba(7,59,48,0.1)" : "none",
                  transition: "all 0.2s",
                  opacity: isInactive ? 0.65 : 1,
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: isInactive ? "#64748b" : "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{c.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted, #64748B)", marginTop: 2 }}>
                    {isInactive ? "⚠️ Currently Unavailable" : `📍 ${c.loc}`}
                  </div>
                  {/* Status Badge */}
                  <div style={{ marginTop: 6 }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: 8,
                      background: isInactive ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.14)",
                      color: isInactive ? "#dc2626" : "#059669",
                      border: isInactive ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(16,185,129,0.25)",
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: isInactive ? "#ef4444" : "#10b981",
                        display: "inline-block",
                      }} />
                      {isInactive ? "Inactive" : "Active"}
                    </span>
                  </div>
                </div>

                {!isInactive ? (
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: isSel ? "5px solid #073B30" : "2px solid rgba(7,59,48,0.25)",
                    background: isSel ? "#F5B800" : "transparent",
                    flexShrink: 0
                  }} />
                ) : (
                  <span style={{ fontSize: 15, color: "#94a3b8" }}>🔒</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 5. PROMO CODE SECTION ─────────────────────────────────────── */}
      <section className="ref-promo-card">
        <div className="ref-promo-label">
          <TicketIcon size={18} color="#073B30" />
          <span>PROMO CODE</span>
        </div>

        <form className="ref-promo-input-wrap" onSubmit={handleApplyCoupon}>
          <input
            type="text"
            className="ref-promo-input"
            placeholder={couponApplied ? "CANTEEN10 (10% Discount Applied!)" : "Enter promo code (try CANTEEN10)"}
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button type="submit" className="ref-promo-apply-btn">
            {couponApplied ? "Applied ✓" : "Apply"}
          </button>
        </form>
      </section>
      {couponError && (
        <div style={{ color: "#dc2626", fontSize: 12, marginTop: -12, paddingLeft: 12 }}>
          Invalid promo code. Try CANTEEN10 for 10% off!
        </div>
      )}
      {couponApplied && (
        <div style={{ color: "#16a34a", fontSize: 12, marginTop: -12, paddingLeft: 12, fontWeight: 700 }}>
          🎉 Coupon CANTEEN10 applied! You saved ₹{discount}!
        </div>
      )}

      {/* Error banner if item is unavailable or backend error */}
      {orderError && (
        <div style={{
          background: "rgba(220,38,38,0.1)",
          border: "1px solid rgba(220,38,38,0.3)",
          color: "#dc2626",
          padding: "10px 16px",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 600,
          margin: "12px 18px",
          textAlign: "center"
        }}>
          ⚠️ {orderError}
        </div>
      )}

      {/* ── 6. BOTTOM STICKY CHECKOUT BAR ─────────────────────────────── */}
      <footer className="ref-cart-sticky-bar">
        <div className="ref-sticky-left">
          <div className="ref-sticky-cart-icon">
            <CartIcon size={20} />
          </div>
          <div className="ref-sticky-total-info">
            <span className="ref-sticky-total-label">Total Amount</span>
            <span className="ref-sticky-total-amount">₹{totalAmount}</span>
          </div>
        </div>

        <div className="ref-sticky-center">
          <ShieldCheckIcon size={18} color="#4ade80" />
          <span>Secure &amp; Safe Checkout · Your data is protected</span>
        </div>

        <button
          type="button"
          className="ref-sticky-checkout-btn"
          onClick={handlePlaceOrder}
          disabled={!hasItems || isPlacing}
          id="cart-place-order-btn"
        >
          <span>{isPlacing ? "Creating Order..." : "Place Order"}</span>
          <span>→</span>
        </button>
      </footer>
    </div>
  );
}
