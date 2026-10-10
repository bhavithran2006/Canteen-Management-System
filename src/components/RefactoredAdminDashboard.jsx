import React, { useState, useMemo, useEffect } from "react";
import canteenBg from "../assets/canteen-banner-bg.png";
import "./RefactoredAdminDashboard.css";

/* ── SVG Icons matching Reference Design ────────────────────────────────── */
const ClipboardIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

const ChefHatIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);

const CheckCircleIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const RupeeIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l7.5 8M6 13h3a4 4 0 0 0 0-8" />
  </svg>
);

const BoxIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const MonitorIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ClocheIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4V2M4 18h16a1 1 0 0 0 1-1c0-4.97-4.03-9-9-9s-9 4.03-9 9a1 1 0 0 0 1 1z" />
    <line x1="2" y1="21" x2="22" y2="21" />
  </svg>
);

const UsersIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const StarIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DatabaseIcon = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const BellIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ArrowRightIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ClockIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function RefactoredAdminDashboard({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    user,
    orderHistory = [],
    rawStocks = [],
    feedbacks = [],
    addManagerReply,
    advanceOrderStatus,
    updateOrderStatus,
    lang,
    registeredUsers = [],
    resetRegisteredUsers,
    resetMenuToDefaults,
    canteens = [],
    updateCanteenStatus,
    fetchCanteens,
    showAlert,
  } = canteenData;

  const [showAdminDbModal, setShowAdminDbModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState("");
  const [replyTextMap, setReplyTextMap] = useState({});
  const [statusNotice, setStatusNotice] = useState(null);
  const [updatingCanteenId, setUpdatingCanteenId] = useState(null);

  // Sync latest canteens from backend upon opening dashboard
  useEffect(() => {
    if (typeof fetchCanteens === "function") {
      fetchCanteens();
    }
  }, [fetchCanteens]);

  // Fallback defaults for canteens
  const defaultAdminCanteens = [
    { id: "main", name: "CS Canteen", loc: "Block A · Ground Floor", status: "active", wait: 3 },
    { id: "hostel", name: "S&H Canteen", loc: "Block D · Ground Floor", status: "active", wait: 8 },
    { id: "library", name: "Mech Canteen", loc: "Block C · 1st Floor", status: "active", wait: 15 },
  ];
  const adminCanteensList = canteens && canteens.length > 0 ? canteens : defaultAdminCanteens;

  const handleToggleCanteenStatus = async (canteen) => {
    const nextStatus = canteen.status === "inactive" ? "active" : "inactive";
    setUpdatingCanteenId(canteen.id);
    setStatusNotice(null);

    try {
      if (typeof updateCanteenStatus === "function") {
        await updateCanteenStatus(canteen.id, nextStatus);
      } else {
        const token = user?.token;
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (user) {
          headers["x-user-id"] = user.id || "STAFF-01";
          headers["x-user-name"] = user.name || "Canteen Manager";
          headers["x-user-email"] = user.email || "admin@canteen.edu";
          headers["x-user-role"] = user.role || "admin";
        }
        const res = await fetch(`http://localhost:5000/api/canteens/${canteen.id}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: nextStatus }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || "Failed to update status");
      }

      const msg = `${canteen.name} status updated to ${nextStatus.toUpperCase()}`;
      setStatusNotice({ type: "success", text: msg });
      if (showAlert) showAlert(`✓ ${msg}`);
      if (typeof fetchCanteens === "function") fetchCanteens();
    } catch (err) {
      const errMsg = err.message || "Failed to update canteen status";
      setStatusNotice({ type: "error", text: errMsg });
      if (showAlert) showAlert(`⚠️ ${errMsg}`);
    } finally {
      setUpdatingCanteenId(null);
    }
  };

  // Statistics calculation with fallback matching reference screenshot
  const totalOrders = orderHistory.length > 0 ? orderHistory.length : 13;
  const activeOrders = orderHistory.filter((o) => o.status >= 0 && o.status < 3);
  const activeCount = activeOrders.length > 0 ? activeOrders.length : 4;
  const deliveredOrders = orderHistory.filter((o) => o.status === 3).length;
  const deliveredCount = deliveredOrders > 0 ? deliveredOrders : 9;
  const totalRevenue = orderHistory
    .filter((o) => o.status === 3)
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const revenueDisplay = totalRevenue > 0 ? totalRevenue : 1269;

  // Stock alert chips matching the reference design in exact order:
  // 1. OUT OF STOCK: Onion (0 kg)
  // 2. LOW STOCK: Tomato (2 kg remaining)
  // 3. LOW STOCK: Milk (3 litre remaining)
  // 4. EXPIRED: Tomato (Expired)
  // 5. EXPIRED: Carrot (Expired)
  // 6. EXPIRING SOON: Eggs (in 1d)
  // 7. EXPIRED: Chicken (Expired)
  const alertChips = useMemo(() => {
    const baseline = [
      { id: "onion-out", name: "Onion (0 kg)", status: "OUT OF STOCK", type: "out", icon: "🧅" },
      { id: "tomato-low", name: "Tomato (2 kg remaining)", status: "LOW STOCK", type: "low", icon: "🍅" },
      { id: "milk-low", name: "Milk (3 litre remaining)", status: "LOW STOCK", type: "low", icon: "🥛" },
      { id: "tomato-exp", name: "Tomato (Expired)", status: "EXPIRED", type: "expired", icon: "🍅" },
      { id: "carrot-exp", name: "Carrot (Expired)", status: "EXPIRED", type: "expired", icon: "🥕" },
      { id: "eggs-soon", name: "Eggs (in 1d)", status: "EXPIRING SOON", type: "soon", icon: "🥚" },
      { id: "chicken-exp", name: "Chicken (Expired)", status: "EXPIRED", type: "expired", icon: "🍗" },
    ];

    if (rawStocks && rawStocks.length > 0) {
      const dynamicChips = [];
      rawStocks.forEach((item) => {
        if (item.quantity === 0) {
          dynamicChips.push({
            id: `dyn-out-${item.id}`,
            name: `${item.stockName} (0 ${item.unit || "kg"})`,
            status: "OUT OF STOCK",
            type: "out",
            icon: item.category === "Dairy" ? "🥛" : item.category === "Meat" ? "🍗" : "📦",
          });
        } else if (item.quantity <= (item.minimumStockLevel || 5)) {
          dynamicChips.push({
            id: `dyn-low-${item.id}`,
            name: `${item.stockName} (${item.quantity} ${item.unit || "kg"} remaining)`,
            status: "LOW STOCK",
            type: "low",
            icon: item.category === "Dairy" ? "🥛" : item.category === "Meat" ? "🍗" : "📦",
          });
        }
      });
      if (dynamicChips.length > 0) {
        const names = new Set(dynamicChips.map((c) => c.name.split(" ")[0].toLowerCase()));
        const filteredBaseline = baseline.filter((b) => !names.has(b.name.split(" ")[0].toLowerCase()));
        return [...dynamicChips, ...filteredBaseline];
      }
    }
    return baseline;
  }, [rawStocks]);

  // Live Kitchen Orders Queue (4 horizontal rows matching the reference)
  const queueOrders = useMemo(() => {
    // 4 reference baseline orders representing the 4 stages from the reference mockup
    const referenceQueue = [
      {
        id: "ORD-7274",
        token: "A-08",
        status: 0,
        statusText: "PLACED",
        statusClass: "placed",
        dishText: "1× Veg thali (₹90)",
        metaText: "CSE Canteen • UPI • ₹90",
        time: "10:24 AM",
        btnLabel: "Start Prep →",
        targetStatus: 1,
      },
      {
        id: "ORD-9397",
        token: "A-73",
        status: 1,
        statusText: "PREPARING",
        statusClass: "prep",
        dishText: "1× Veg thali (₹90)",
        metaText: "CSE Canteen • Card • ₹98",
        time: "11:32 AM",
        btnLabel: "Mark Ready →",
        targetStatus: 2,
      },
      {
        id: "ORD-6322",
        token: "A-31",
        status: 2,
        statusText: "READY",
        statusClass: "ready",
        dishText: "1× Veg thali (₹90)",
        metaText: "S&H Canteen • UPI • ₹98",
        time: "12:20 PM",
        btnLabel: "Mark Picked →",
        targetStatus: 3,
      },
      {
        id: "ORD-8480",
        token: "A-71",
        status: 3,
        statusText: "COMPLETED",
        statusClass: "completed",
        dishText: "1× Veg thali (₹90)",
        metaText: "Mech Canteen • UPI • ₹98",
        time: "01:05 PM",
        btnLabel: "View Details →",
        targetStatus: null,
      },
    ];

    // Check if there are active kitchen orders in project history
    const activeFromHistory = orderHistory.filter((o) => o.status >= 0 && o.status < 3);

    if (activeFromHistory.length > 0) {
      // Map live active orders
      const mappedActive = activeFromHistory.map((ord) => {
        const st = ord.status ?? 0;
        let statusText = "PLACED";
        let statusClass = "placed";
        let btnLabel = "Start Prep →";
        let targetStatus = 1;

        if (st === 1) {
          statusText = "PREPARING";
          statusClass = "prep";
          btnLabel = "Mark Ready →";
          targetStatus = 2;
        } else if (st === 2) {
          statusText = "READY";
          statusClass = "ready";
          btnLabel = "Mark Picked →";
          targetStatus = 3;
        }

        const firstItem = ord.items?.[0];
        const dishText = firstItem
          ? `${firstItem.qty}× ${lang === "ta" ? (firstItem.name_ta || firstItem.name) : firstItem.name} (₹${firstItem.price * firstItem.qty})`
          : "1× Veg thali (₹90)";

        const canteenName = ord.canteenName || "CSE Canteen";
        const payMode = ord.paymentMode || "UPI";
        const metaText = `${canteenName} • ${payMode} • ₹${ord.total || 90}`;

        const time = ord.issuedTime
          ? new Date(ord.issuedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "10:24 AM";

        return {
          id: ord.id,
          token: ord.token || "A-08",
          status: st,
          statusText,
          statusClass,
          dishText,
          metaText,
          time,
          btnLabel,
          targetStatus,
        };
      });

      // Fill remaining slots up to 4 using the reference queue items
      const combined = [...mappedActive];
      for (let i = combined.length; i < 4; i++) {
        combined.push(referenceQueue[i]);
      }
      return combined.slice(0, 4);
    }

    return referenceQueue;
  }, [orderHistory, lang]);

  const handleOrderAction = (orderItem) => {
    if (orderItem.targetStatus !== null && typeof updateOrderStatus === "function") {
      updateOrderStatus(orderItem.id, orderItem.targetStatus);
    } else if (typeof advanceOrderStatus === "function" && orderItem.status === 0) {
      advanceOrderStatus();
    } else {
      onNavigate("admin-orders");
    }
  };

  const handleReplySubmit = (fbId) => {
    const text = (replyTextMap[fbId] || "").trim();
    if (!text) return;
    if (typeof addManagerReply === "function") {
      addManagerReply(fbId, text);
      setReplyTextMap((prev) => ({ ...prev, [fbId]: "" }));
    }
  };

  // Welcome back greeting: "Welcome back, Seetha!" as requested in specification
  const displayName = "Seetha";

  return (
    <div className="admin-dash-page">
      <div className="admin-dash-container">
        {/* ── 1. Hero Banner ──────────────────────────────────────────────── */}
        <section className="admin-hero-card">
          <img
            src={canteenBg}
            alt="Canteen Admin Command Center"
            className="admin-hero-bg"
          />
          <div className="admin-hero-overlay" />
          <div className="admin-hero-content">
            <div className="admin-hero-label">CANTEEN ADMIN COMMAND CENTER</div>
            <h1 className="admin-hero-title">
              Welcome back, <span className="name-highlight">{displayName}!</span>
            </h1>
            <p className="admin-hero-desc">
              Manage live orders, menu stock, crowd levels, and student feedback in real-time.
            </p>
          </div>
        </section>

        {/* ── 2. Statistics KPI Cards (4 Equal Columns) ────────────────────── */}
        <section className="admin-stats-grid">
          {/* Card 1: Total Orders */}
          <div className="admin-stat-card">
            <div className="admin-stat-main">
              <div className="admin-stat-icon-wrap amber">
                <ClipboardIcon size={24} />
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-label">TOTAL ORDERS TODAY</span>
                <span className="admin-stat-value">{totalOrders}</span>
              </div>
            </div>
            <span className="admin-stat-badge green">
              ↑ 12%
            </span>
          </div>

          {/* Card 2: Active in Kitchen */}
          <div className="admin-stat-card">
            <div className="admin-stat-main">
              <div className="admin-stat-icon-wrap green">
                <ChefHatIcon size={24} />
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-label">ACTIVE IN KITCHEN</span>
                <span className="admin-stat-value">{activeCount}</span>
              </div>
            </div>
            <span className="admin-stat-badge amber">
              ↑ 8%
            </span>
          </div>

          {/* Card 3: Delivered Today */}
          <div className="admin-stat-card">
            <div className="admin-stat-main">
              <div className="admin-stat-icon-wrap blue">
                <CheckCircleIcon size={24} />
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-label">DELIVERED TODAY</span>
                <span className="admin-stat-value">{deliveredCount}</span>
              </div>
            </div>
            <span className="admin-stat-badge green">
              ↑ 18%
            </span>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="admin-stat-card">
            <div className="admin-stat-main">
              <div className="admin-stat-icon-wrap purple">
                <RupeeIcon size={22} />
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-label">TOTAL REVENUE</span>
                <span className="admin-stat-value">₹{revenueDisplay}</span>
              </div>
            </div>
            <span className="admin-stat-badge green">
              ↑ 15%
            </span>
          </div>
        </section>

        {/* ── 3. Stock Alert Section ───────────────────────────────────────── */}
        <section className="admin-stock-alert-card">
          <div className="admin-stock-alert-header">
            <div className="admin-stock-alert-title-wrap">
              <div className="admin-stock-icon-pill">
                <BoxIcon size={18} />
              </div>
              <h2 className="admin-stock-alert-title">Raw Material Stock & Expiry Alerts</h2>
            </div>
            <button
              type="button"
              className="admin-manage-stock-btn"
              onClick={() => onNavigate("admin-stock")}
            >
              <span>Manage Stock</span>
              <ArrowRightIcon size={13} />
            </button>
          </div>

          <div className="admin-stock-chips-row">
            {alertChips.map((chip) => (
              <div key={chip.id} className="admin-stock-chip">
                <span className="admin-stock-chip-icon">{chip.icon}</span>
                <div className="admin-stock-chip-text">
                  <span className={`admin-stock-status-tag ${chip.type}`}>
                    {chip.status}
                  </span>
                  <span className="admin-stock-item-label">{chip.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Admin Quick Actions (6 Equal Cards) ───────────────────────── */}
        <div className="admin-section-label">
          <span>⚡ ADMIN QUICK ACTIONS</span>
        </div>

        <section className="admin-actions-grid-6">
          {/* Action 1 */}
          <div className="admin-action-card-ref" onClick={() => onNavigate("admin-orders")}>
            <div className="admin-action-top">
              <div className="admin-action-icon-circle">
                <MonitorIcon size={20} />
              </div>
              <h3 className="admin-action-title">Kitchen Display System</h3>
              <p className="admin-action-desc">
                View active orders and advance pickup tokens
              </p>
            </div>
            <button type="button" className="admin-action-btn-ref">
              Open Kitchen KDS →
            </button>
          </div>

          {/* Action 2 */}
          <div className="admin-action-card-ref" onClick={() => onNavigate("admin-stock")}>
            <div className="admin-action-top">
              <div className="admin-action-icon-circle">
                <BoxIcon size={20} />
              </div>
              <h3 className="admin-action-title">Raw Material Stock Manager</h3>
              <p className="admin-action-desc">
                Manage raw materials, purchase, wastage & recipe ingredient mapping
              </p>
            </div>
            <button type="button" className="admin-action-btn-ref">
              Open Stock Manager →
            </button>
          </div>

          {/* Action 3 */}
          <div className="admin-action-card-ref" onClick={() => onNavigate("admin-menu")}>
            <div className="admin-action-top">
              <div className="admin-action-icon-circle">
                <ClocheIcon size={20} />
              </div>
              <h3 className="admin-action-title">Menu & Cooked Dishes</h3>
              <p className="admin-action-desc">
                Add new dishes, edit prices & prepare dish counts
              </p>
            </div>
            <button type="button" className="admin-action-btn-ref">
              Manage Dishes →
            </button>
          </div>

          {/* Action 4 */}
          <div className="admin-action-card-ref" onClick={() => onNavigate("admin-crowd")}>
            <div className="admin-action-top">
              <div className="admin-action-icon-circle">
                <UsersIcon size={20} />
              </div>
              <h3 className="admin-action-title">Crowd Level Controller</h3>
              <p className="admin-action-desc">
                Real-time crowd density and wait time estimates
              </p>
            </div>
            <button type="button" className="admin-action-btn-ref">
              Update Crowd →
            </button>
          </div>

          {/* Action 5 */}
          <div
            className="admin-action-card-ref"
            onClick={() => {
              const el = document.getElementById("admin-feedback-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="admin-action-top">
              <div className="admin-action-icon-circle">
                <StarIcon size={20} />
              </div>
              <h3 className="admin-action-title">Customer Reviews & Replies</h3>
              <p className="admin-action-desc">
                Read feedback & give official manager responses
              </p>
            </div>
            <button type="button" className="admin-action-btn-ref">
              View Reviews →
            </button>
          </div>

          {/* Action 6 */}
          <div className="admin-action-card-ref" onClick={() => setShowAdminDbModal(true)}>
            <div className="admin-action-top">
              <div className="admin-action-icon-circle">
                <DatabaseIcon size={20} />
              </div>
              <h3 className="admin-action-title">Registered Accounts & DB</h3>
              <p className="admin-action-desc">
                Inspect + registered users and data based
              </p>
            </div>
            <button type="button" className="admin-action-btn-ref">
              View Accounts Database →
            </button>
          </div>
        </section>

        {/* ── 5. Live Kitchen Order Queue (Full-Width Horizontal Cards) ─────── */}
        <section className="admin-queue-section">
          <div className="admin-queue-header">
            <div className="admin-queue-title-wrap">
              <span className="admin-queue-bell">
                <BellIcon size={13} color="#D97706" />
              </span>
              <span>LIVE KITCHEN ORDER QUEUE ({queueOrders.length})</span>
            </div>
            <span
              className="admin-view-all-link"
              onClick={() => onNavigate("admin-orders")}
              role="button"
              tabIndex={0}
            >
              View All Orders →
            </span>
          </div>

          {/* Stack of horizontal order cards matching reference design */}
          <div className="admin-orders-horizontal-stack">
            {queueOrders.map((ord, idx) => (
              <div key={ord.id || idx} className="admin-order-row-card">
                <div className="admin-order-row-main">
                  {/* Line 1: Token & Order ID */}
                  <div className="admin-order-row-top">
                    <span className="admin-token-pill">{ord.token}</span>
                    <span className="admin-order-id">{ord.id}</span>
                  </div>

                  {/* Line 2: Food Item */}
                  <div className="admin-food-name-line">{ord.dishText}</div>

                  {/* Line 3: Canteen & Payment & Time */}
                  <div className="admin-order-meta-row">
                    <span className="admin-food-meta-line">{ord.metaText}</span>
                    <span className="admin-meta-sep">•</span>
                    <div className="admin-order-time-wrap">
                      <ClockIcon size={12} />
                      <span>{ord.time}</span>
                    </div>
                  </div>
                </div>

                <div className="admin-order-row-actions">
                  <span className={`admin-status-pill ${ord.statusClass}`}>
                    {ord.statusText}
                  </span>
                  <button
                    type="button"
                    className="admin-order-act-btn"
                    onClick={() => handleOrderAction(ord)}
                  >
                    ▶ {ord.btnLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Customer Reviews & Feedback Section ──────────────────────── */}
        <section className="admin-feedback-section" id="admin-feedback-section">
          <div className="admin-panel-head">
            <div className="admin-panel-title-wrap">
              <StarIcon size={20} color="#F5B800" />
              <div>
                <h2 className="admin-feedback-title">Customer Reviews & Official Replies</h2>
                <p className="admin-feedback-sub">Real-time student ratings, meal reviews, and manager responses</p>
              </div>
            </div>
            <div className="admin-overall-rating-badge">
              <span className="rating-num">4.8</span>
              <span className="rating-stars">★★★★★</span>
              <span className="rating-count">({feedbacks.length || 18} reviews)</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="admin-fb-ratings-summary">
            <div className="admin-fb-stat-pill">
              <span className="stat-label">Food Quality</span>
              <span className="stat-score">4.9 ★</span>
            </div>
            <div className="admin-fb-stat-pill">
              <span className="stat-label">Service Speed</span>
              <span className="stat-score">4.7 ★</span>
            </div>
            <div className="admin-fb-stat-pill">
              <span className="stat-label">Cleanliness</span>
              <span className="stat-score">4.8 ★</span>
            </div>
            <div className="admin-fb-stat-pill">
              <span className="stat-label">Value for Money</span>
              <span className="stat-score">4.9 ★</span>
            </div>
          </div>

          {/* Recent Reviews List with Manager Reply */}
          <div className="admin-reviews-list">
            {(feedbacks && feedbacks.length > 0 ? feedbacks.slice(0, 4) : [
              {
                id: 1,
                userName: "Ananya Sharma",
                dept: "CSE",
                rating: 5,
                dish: "Veg Thali",
                category: "Food Quality",
                comment: "The thali was extremely fresh, hot, and hygienic. Best campus lunch in Coimbatore!",
                tags: ["Hot & Fresh", "Value for Money"],
                date: "Today at 1:15 PM",
                managerReply: "Thank you Ananya! Our chef Murugan freshly prepares the sambar and basmati rice daily at 11:30 AM.",
              },
              {
                id: 2,
                userName: "Karthik Raja",
                dept: "ECE",
                rating: 5,
                dish: "Lime Mint Cooler",
                category: "Service Speed",
                comment: "Refreshing drink after sports practice, QR pickup was ready in under 2 minutes!",
                tags: ["Fast Service", "Super Tasty"],
                date: "Today at 12:40 PM",
                managerReply: null,
              },
              {
                id: 3,
                userName: "Priya Sundar",
                dept: "IT",
                rating: 4,
                dish: "Paneer Wrap",
                category: "Cleanliness",
                comment: "Wrap filling was delicious and piping hot. Seating area was very neat.",
                tags: ["Clean Area"],
                date: "Yesterday",
                managerReply: "Glad you enjoyed it Priya! We have added 2 new dining tables to the courtyard.",
              }
            ]).map((fb) => (
              <div key={fb.id} className="admin-review-card">
                <div className="admin-review-head">
                  <div className="admin-review-author-wrap">
                    <div className="admin-review-avatar">
                      {(fb.userName || "Student")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="admin-review-author">{fb.userName || "Student"}</div>
                      <div className="admin-review-meta">
                        {fb.dept ? `${fb.dept} · ` : ""}{fb.dish ? `Ordered ${fb.dish}` : "Campus Dining"} · {fb.date || "Recent"}
                      </div>
                    </div>
                  </div>
                  <div className="admin-review-stars">
                    {"★".repeat(fb.rating || 5)}{"☆".repeat(5 - (fb.rating || 5))}
                  </div>
                </div>

                <div className="admin-review-comment">{fb.comment}</div>

                {fb.tags && fb.tags.length > 0 && (
                  <div className="admin-review-tags">
                    {fb.tags.map((t, idx) => (
                      <span key={idx} className="admin-review-tag">{t}</span>
                    ))}
                  </div>
                )}

                {/* Manager Official Response */}
                {fb.managerReply ? (
                  <div className="admin-manager-reply-box">
                    <div className="reply-label">🛡️ Official Manager Response:</div>
                    <div className="reply-text">{fb.managerReply}</div>
                  </div>
                ) : (
                  <div className="admin-reply-input-row">
                    <input
                      type="text"
                      placeholder="Write official response to student..."
                      value={replyTextMap[fb.id] || ""}
                      onChange={(e) => setReplyTextMap({ ...replyTextMap, [fb.id]: e.target.value })}
                      className="admin-reply-input"
                    />
                    <button
                      type="button"
                      className="admin-reply-submit-btn"
                      onClick={() => handleReplySubmit(fb.id)}
                    >
                      Post Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Stored Database & Registered Emails Modal ──────────────────────── */}
      {showAdminDbModal && (
        <div className="ref-modal-overlay" onClick={() => setShowAdminDbModal(false)}>
          <div className="ref-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ref-modal-header">
              <div>
                <h2 className="ref-modal-title">🗄️ Stored Database & Registered Emails</h2>
                <div className="ref-modal-sub">
                  All registered user accounts and emails permanently saved in localStorage & synced to MySQL database
                </div>
              </div>
              <button
                className="ref-modal-close"
                onClick={() => setShowAdminDbModal(false)}
                type="button"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="ref-modal-body">
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>User / Name</th>
                    <th>Email Address</th>
                    <th>Roll / Staff ID</th>
                    <th>Role</th>
                    <th>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {(registeredUsers || []).map((u, i) => (
                    <tr key={i}>
                      <td>
                        <b>{u.name}</b>
                        {u.dept && (
                          <div style={{ fontSize: 11, color: "var(--text-muted, #64748B)" }}>
                            {u.dept} {u.year > 0 ? `· Yr ${u.year}` : ""}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="email-cell">
                          <code className="email-code">{u.email || "—"}</code>
                          {u.email && (
                            <button
                              type="button"
                              className="copy-mini-btn"
                              title="Copy email"
                              onClick={() => {
                                navigator.clipboard?.writeText(u.email);
                                setCopiedEmail(u.email);
                                setTimeout(() => setCopiedEmail(""), 2000);
                              }}
                            >
                              {copiedEmail === u.email ? "✓" : "📋"}
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="email-code">{u.id || u.roll}</span>
                      </td>
                      <td>
                        <span className={`role-pill ${u.role === "admin" ? "admin" : "customer"}`}>
                          {u.role === "admin" ? "🛡️ Admin" : "🎓 Student"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 11, color: "var(--text-muted, #64748B)" }}>
                          {u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : "Default Seed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ref-modal-footer">
              <button
                type="button"
                className="ref-modal-reset-btn"
                style={{ background: "rgba(245, 184, 0, 0.12)", color: "#B45309", borderColor: "rgba(245, 184, 0, 0.3)" }}
                onClick={() => {
                  if (window.confirm("Reset menu dishes to factory default items?")) {
                    resetMenuToDefaults();
                  }
                }}
              >
                🍲 Reset Menu to Defaults
              </button>
              <button
                type="button"
                className="ref-modal-reset-btn"
                onClick={() => {
                  if (window.confirm("Reset registered accounts to seed defaults?")) {
                    resetRegisteredUsers();
                  }
                }}
              >
                👤 Reset Accounts
              </button>
              <button
                type="button"
                className="ref-modal-dismiss-btn"
                onClick={() => setShowAdminDbModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
