import React, { useState, useEffect } from "react";
import csCanteenImg from "../assets/cs-canteen.jpg";
import shCanteenImg from "../assets/sh-canteen.jpg";
import mechCanteenImg from "../assets/mech-canteen.jpg";
import heroBannerImg from "../assets/hero-banner.png"; // 4K 4096x580 lossless hero banner matching reference image 2

// Icons used in Homepage
const ForkKnifeIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v20M21 2v4a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V2" />
    <path d="M3 2v7c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2M5 11v11" />
  </svg>
);

const ChefHatIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);

const UsersIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const WalletIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" />
    <path d="M18 12a2 2 0 0 0 0 4h3v-4Z" />
  </svg>
);

const ArrowRightIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const MapPinIcon = ({ size = 13, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = ({ size = 13, color = "#64748b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function RefactoredHomePage({ onNavigate, onOpenChat, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    walletBalance = 340,
    canteens = [],
    selectedCanteen,
    setSelectedCanteen,
    showAlert,
    cart = {},
  } = canteenData;

  const [liveCanteens, setLiveCanteens] = useState(canteens);

  // Fetch live crowd data from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchCrowd = () => {
      fetch("http://localhost:5000/api/canteens")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setLiveCanteens(data);
          }
        })
        .catch(() => {
          if (isMounted && canteens.length > 0) {
            setLiveCanteens(canteens);
          }
        });
    };

    fetchCrowd();
    const interval = setInterval(fetchCrowd, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [canteens]);

  // Standardized canteens metadata with imported bundled assets
  const CANTEEN_CARDS = [
    {
      id: "main",
      key: "main",
      name: "CS Canteen",
      loc: "Block A · Ground Floor",
      img: csCanteenImg,
      defaultLevel: "low",
      defaultWait: 3,
    },
    {
      id: "hostel",
      key: "hostel",
      name: "S&H Canteen",
      loc: "Block D · Ground Floor",
      img: shCanteenImg,
      defaultLevel: "med",
      defaultWait: 8,
    },
    {
      id: "library",
      key: "library",
      name: "Mech Canteen",
      loc: "Block C · 1st Floor",
      img: mechCanteenImg,
      defaultLevel: "high",
      defaultWait: 15,
    },
  ];

  // Helper to extract live level, wait time & operational status
  const getCanteenLive = (canteenDef) => {
    const found = liveCanteens.find(
      (c) =>
        c.id === canteenDef.id ||
        (c.name && c.name.toLowerCase().includes(canteenDef.name.slice(0, 4).toLowerCase()))
    );
    const level = found ? found.level : canteenDef.defaultLevel;
    const wait = found && found.wait ? found.wait : canteenDef.defaultWait;
    const status = found && found.status ? found.status : "active";
    return { level, wait, status };
  };

  const handleChooseCanteen = (canteenDef) => {
    const { status } = getCanteenLive(canteenDef);
    if (status === "inactive") {
      if (showAlert) {
        showAlert(`${canteenDef.name} is currently inactive. Please choose an active canteen.`);
      }
      return;
    }

    if (setSelectedCanteen) {
      setSelectedCanteen(canteenDef.id);
    }
    try {
      localStorage.setItem("canteen_selected_canteen", canteenDef.id);
    } catch (e) {}

    if (showAlert) {
      showAlert(`${canteenDef.name} selected! Browse our freshly served meals.`);
    }

    const hasCartItems = Object.values(cart || {}).some((qty) => qty > 0);
    if (hasCartItems) {
      onNavigate("canteen-select");
    } else {
      onNavigate("menu");
    }
  };

  return (
    <div className="ref-home-container">
      {/* ── 1. HERO BANNER ───────────────────────────────────── */}
      <div className="ref-hero-banner">
        <img
          src={heroBannerImg}
          alt="Delicious meals, freshly served - Browse our menu and order in seconds"
          className="ref-hero-img"
          draggable={false}
        />
      </div>

      {/* ── 2. QUICK ACTION CARDS ───────────────────────────── */}
      <div className="ref-quick-grid">
        {/* Card 1: Order Now */}
        <div
          className="ref-quick-card card-order"
          onClick={() => onNavigate("menu")}
          role="button"
          tabIndex={0}
        >
          <div className="ref-quick-left">
            <div className="ref-quick-icon bg-gold">
              <ForkKnifeIcon size={20} color="#ffffff" />
            </div>
            <div className="ref-quick-info">
              <h3 className="ref-quick-title">Order Now</h3>
              <p className="ref-quick-desc">Explore the menu and place your order</p>
            </div>
          </div>
          <div className="ref-quick-arrow arrow-gold">
            <ArrowRightIcon size={14} color="#b45309" />
          </div>
        </div>

        {/* Card 2: Ask Chef AI */}
        <div
          className="ref-quick-card card-chef"
          onClick={onOpenChat}
          role="button"
          tabIndex={0}
        >
          <div className="ref-quick-left">
            <div className="ref-quick-icon bg-green">
              <ChefHatIcon size={22} color="#ffffff" />
            </div>
            <div className="ref-quick-info">
              <h3 className="ref-quick-title">Ask Chef AI</h3>
              <p className="ref-quick-desc">Get recipe suggestions, food info and more</p>
            </div>
          </div>
          <div className="ref-quick-arrow arrow-green">
            <ArrowRightIcon size={14} color="#15803d" />
          </div>
        </div>

        {/* Card 3: Queue & Waitlist */}
        <div
          className="ref-quick-card card-queue"
          onClick={() => onNavigate("tracking")}
          role="button"
          tabIndex={0}
        >
          <div className="ref-quick-left">
            <div className="ref-quick-icon bg-blue">
              <UsersIcon size={20} color="#ffffff" />
            </div>
            <div className="ref-quick-info">
              <h3 className="ref-quick-title">Queue & Waitlist</h3>
              <p className="ref-quick-desc">Check your position in the queue</p>
            </div>
          </div>
          <div className="ref-quick-arrow arrow-blue">
            <ArrowRightIcon size={14} color="#1d4ed8" />
          </div>
        </div>

        {/* Card 4: Wallet */}
        <div
          className="ref-quick-card card-wallet"
          onClick={() => onNavigate("menu")}
          role="button"
          tabIndex={0}
        >
          <div className="ref-quick-left">
            <div className="ref-quick-icon bg-purple">
              <WalletIcon size={20} color="#ffffff" />
            </div>
            <div className="ref-quick-info">
              <h3 className="ref-quick-title">Wallet</h3>
              <p className="ref-quick-desc">Available balance</p>
              <div className="ref-wallet-amount">₹{walletBalance}</div>
            </div>
          </div>
          <div className="ref-quick-arrow arrow-purple">
            <ArrowRightIcon size={14} color="#6d28d9" />
          </div>
        </div>
      </div>

      {/* ── 3. HAPPENING NOW (LIVE CANTEEN STATUS) ──────────── */}
      <div className="ref-happening-section">
        <div className="ref-happening-header">
          <div className="ref-happening-left">
            <span className="ref-section-bar" />
            <h2 className="ref-section-title">HAPPENING NOW</h2>
          </div>
          <div className="ref-live-indicator">
            <span className="ref-live-dot" />
            <span className="ref-live-text">Live Canteen Status</span>
          </div>
        </div>

        <div className="ref-canteens-grid">
          {CANTEEN_CARDS.map((canteen) => {
            const { level, wait, status } = getCanteenLive(canteen);
            const isInactive = status === "inactive";
            const isSelected = selectedCanteen === canteen.id && !isInactive;

            return (
              <div
                key={canteen.id}
                className={`ref-canteen-card ${isSelected ? "selected" : ""}`}
                style={{
                  opacity: isInactive ? 0.72 : 1,
                  filter: isInactive ? "grayscale(0.35)" : "none",
                  border: isInactive ? "1.5px dashed rgba(239,68,68,0.3)" : undefined
                }}
              >
                <div className="ref-card-main">
                  <div className="ref-thumb-wrap">
                    <img
                      src={canteen.img}
                      alt={canteen.name}
                      className="ref-canteen-thumb"
                    />
                  </div>

                  <div className="ref-card-details">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                      <h3 className="ref-canteen-name" style={{ margin: 0 }}>{canteen.name}</h3>
                      {/* Status Badge */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 7px",
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 800,
                          background: isInactive ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
                          color: isInactive ? "#dc2626" : "#059669",
                          border: isInactive ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(16,185,129,0.25)",
                          flexShrink: 0
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: isInactive ? "#ef4444" : "#10b981",
                            display: "inline-block",
                          }}
                        />
                        {isInactive ? "Inactive" : "Active"}
                      </span>
                    </div>

                    <div className="ref-canteen-loc">
                      <MapPinIcon size={12} color="#64748b" />
                      <span>{isInactive ? "Orders currently disabled" : canteen.loc}</span>
                    </div>

                    {!isInactive ? (
                      <>
                        <div className="ref-badge-row">
                          {level === "low" && (
                            <div className="ref-crowd-pill pill-low">
                              <UsersIcon size={12} color="#15803d" />
                              <span>Low Crowd</span>
                            </div>
                          )}
                          {level === "med" && (
                            <div className="ref-crowd-pill pill-med">
                              <UsersIcon size={12} color="#b45309" />
                              <span>Medium Crowd</span>
                            </div>
                          )}
                          {level === "high" && (
                            <div className="ref-crowd-pill pill-high">
                              <UsersIcon size={12} color="#b91c1c" />
                              <span>High Crowd</span>
                            </div>
                          )}
                        </div>

                        <div className="ref-wait-row">
                          <ClockIcon size={12} color="#64748b" />
                          <span>~ {wait} min wait</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 11.5, color: "#dc2626", fontWeight: 600, marginTop: 4 }}>
                        🔒 Closed for student orders
                      </div>
                    )}
                  </div>
                </div>

                {isInactive ? (
                  <button
                    type="button"
                    className="ref-choose-btn"
                    disabled
                    style={{
                      background: "#e2e8f0",
                      borderColor: "#cbd5e1",
                      color: "#64748b",
                      cursor: "not-allowed",
                      opacity: 0.8
                    }}
                  >
                    <span>🔒</span>
                    <span>Currently Unavailable</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ref-choose-btn"
                    onClick={() => handleChooseCanteen(canteen)}
                    title={`Select ${canteen.name} for food ordering`}
                  >
                    <ForkKnifeIcon size={15} color="#1e293b" />
                    <span>Choose Canteen</span>
                    <span className="ref-btn-arr">→</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
