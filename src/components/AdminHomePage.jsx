import React, { useMemo } from "react";
import canteenBg from "../assets/canteen-banner-bg.png";
import "./AdminHomePage.css";

/* ── SVG Icons ────────────────────────────────────────────────────────────── */
const ClipboardIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

const ChefHatIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);

const CheckCircleIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const RupeeIcon = ({ size = 19, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l7.5 8M6 13h3a4 4 0 0 0 0-8" />
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

const AlertTriangleIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ArrowRightIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function AdminHomePage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    orderHistory = [],
    rawStocks = [],
    canteens = [],
    user,
    lang = "en",
  } = canteenData;

  // Real or baseline calculations
  const totalOrders = orderHistory.length > 0 ? orderHistory.length : 13;
  const activeOrders = orderHistory.filter((o) => o.status >= 0 && o.status < 3);
  const activeCount = activeOrders.length > 0 ? activeOrders.length : 4;
  const completedOrders = orderHistory.filter((o) => o.status === 3);
  const completedCount = completedOrders.length > 0 ? completedOrders.length : 9;
  const totalRevenue = orderHistory
    .filter((o) => o.status === 3)
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const revenueDisplay = totalRevenue > 0 ? totalRevenue : 1269;

  // Low stock / expiry items
  const alertStocks = useMemo(() => {
    const alerts = [];
    (rawStocks || []).forEach((item) => {
      if (item.quantity === 0) {
        alerts.push({ name: item.stockName, qty: `0 ${item.unit || "kg"}`, status: "OUT OF STOCK", level: "critical" });
      } else if (item.quantity <= (item.minimumStockLevel || 5)) {
        alerts.push({ name: item.stockName, qty: `${item.quantity} ${item.unit || "kg"} left`, status: "LOW STOCK", level: "warning" });
      }
    });
    if (alerts.length === 0) {
      return [
        { name: "Onion", qty: "0 kg", status: "OUT OF STOCK", level: "critical" },
        { name: "Tomato", qty: "2 kg left", status: "LOW STOCK", level: "warning" },
        { name: "Milk", qty: "3 litre left", status: "LOW STOCK", level: "warning" },
        { name: "Eggs", qty: "Expiring in 1 day", status: "EXPIRING SOON", level: "warning" },
      ];
    }
    return alerts.slice(0, 6);
  }, [rawStocks]);

  // Canteens crowd mapping
  const canteensList = useMemo(() => {
    const defaultList = [
      { id: "main", name: "CSE Canteen", level: "LOW", people: 25, wait: "3 mins", status: "Smooth Ordering" },
      { id: "law", name: "S&H Canteen", level: "HIGH", people: 85, wait: "14 mins", status: "Busy Rush" },
      { id: "library", name: "Mech Canteen", level: "MEDIUM", people: 60, wait: "7 mins", status: "Moderate Seating" },
    ];
    if (canteens && canteens.length > 0) {
      return defaultList.map((d) => {
        const live = canteens.find((c) => c.id === d.id || c.name?.toLowerCase().includes(d.name.split(" ")[0].toLowerCase()));
        if (live) {
          const lvl = (live.level || "low").toUpperCase();
          return {
            ...d,
            name: live.name || d.name,
            level: lvl === "MED" ? "MEDIUM" : lvl,
            wait: `${live.wait || 5} mins`,
          };
        }
        return d;
      });
    }
    return defaultList;
  }, [canteens]);

  // Recent orders
  const recentOrders = useMemo(() => {
    if (orderHistory && orderHistory.length > 0) {
      return orderHistory.slice(0, 5);
    }
    return [
      { id: "ORD-7274", token: "A-08", customer: "Ananya Sharma", items: [{ name: "Veg thali", qty: 1 }], canteenName: "CSE Canteen", payMode: "UPI", total: 90, status: 0, time: "10:24 AM" },
      { id: "ORD-9397", token: "A-73", customer: "Karthik Raja", items: [{ name: "Veg thali", qty: 1 }], canteenName: "CSE Canteen", payMode: "UPI", total: 98, status: 1, time: "11:32 AM" },
      { id: "ORD-6322", token: "A-31", customer: "Priya Sundar", items: [{ name: "Paneer wrap", qty: 2 }], canteenName: "S&H Canteen", payMode: "Card", total: 140, status: 2, time: "12:20 PM" },
      { id: "ORD-8480", token: "A-71", customer: "Murugan K", items: [{ name: "Chicken biryani", qty: 1 }], canteenName: "Mech Canteen", payMode: "UPI", total: 130, status: 3, time: "01:05 PM" },
    ];
  }, [orderHistory]);

  const getStatusLabel = (st) => {
    switch (st) {
      case 0: return { text: "PLACED", cls: "placed" };
      case 1: return { text: "PREPARING", cls: "prep" };
      case 2: return { text: "READY FOR PICKUP", cls: "ready" };
      case 3: return { text: "COMPLETED", cls: "completed" };
      default: return { text: "PLACED", cls: "placed" };
    }
  };

  return (
    <div className="adm-home-page">
      <div className="adm-home-container">
        {/* ── 1. Hero Overview Banner ─────────────────────────────────── */}
        <section className="adm-home-hero">
          <img src={canteenBg} alt="Campus Canteen" className="adm-hero-img" />
          <div className="adm-hero-grad" />
          <div className="adm-hero-content">
            <div className="adm-hero-tag">CAMPUS CANTEEN · ADMIN OVERVIEW</div>
            <h1 className="adm-hero-heading">
              Welcome back, <span className="highlight-gold">Seetha!</span>
            </h1>
            <p className="adm-hero-sub">
              Live operational overview of food orders, kitchen queues, crowd density, and inventory alerts.
            </p>
            <div className="adm-hero-quick-links">
              <button type="button" className="adm-quick-chip" onClick={() => onNavigate("admin-dashboard")}>
                📊 Admin Dashboard
              </button>
              <button type="button" className="adm-quick-chip" onClick={() => onNavigate("admin-orders")}>
                📋 Kitchen Orders ({activeCount})
              </button>
              <button type="button" className="adm-quick-chip" onClick={() => onNavigate("admin-stock")}>
                📦 Stock Manager
              </button>
              <button type="button" className="adm-quick-chip" onClick={() => onNavigate("qr-scanner")}>
                📱 QR Scanner
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. Statistics Grid ────────────────────────────────────────── */}
        <section className="adm-stats-row">
          <div className="adm-stat-box">
            <div className="adm-stat-icon-wrap amber">
              <ClipboardIcon size={22} />
            </div>
            <div className="adm-stat-data">
              <div className="adm-stat-num">{totalOrders}</div>
              <div className="adm-stat-title">TODAY'S TOTAL ORDERS</div>
            </div>
            <div className="adm-stat-pill green">↑ 12% today</div>
          </div>

          <div className="adm-stat-box">
            <div className="adm-stat-icon-wrap green">
              <ChefHatIcon size={22} />
            </div>
            <div className="adm-stat-data">
              <div className="adm-stat-num">{activeCount}</div>
              <div className="adm-stat-title">ACTIVE KITCHEN ORDERS</div>
            </div>
            <div className="adm-stat-pill amber">Live queue</div>
          </div>

          <div className="adm-stat-box">
            <div className="adm-stat-icon-wrap blue">
              <CheckCircleIcon size={22} />
            </div>
            <div className="adm-stat-data">
              <div className="adm-stat-num">{completedCount}</div>
              <div className="adm-stat-title">COMPLETED TODAY</div>
            </div>
            <div className="adm-stat-pill green">Delivered</div>
          </div>

          <div className="adm-stat-box">
            <div className="adm-stat-icon-wrap purple">
              <RupeeIcon size={20} />
            </div>
            <div className="adm-stat-data">
              <div className="adm-stat-num">₹{revenueDisplay}</div>
              <div className="adm-stat-title">TOTAL REVENUE TODAY</div>
            </div>
            <div className="adm-stat-pill green">UPI + Cash</div>
          </div>
        </section>

        {/* ── 3. Operational Two-Column: Crowd Levels & Low Stock ─────────── */}
        <div className="adm-dual-grid">
          {/* Left: Current Crowd Levels */}
          <section className="adm-card-panel">
            <div className="adm-panel-head">
              <div className="adm-panel-title-wrap">
                <UsersIcon size={18} color="#073B30" />
                <h2 className="adm-panel-title">Current Crowd Levels</h2>
              </div>
              <button
                type="button"
                className="adm-panel-action-btn"
                onClick={() => onNavigate("admin-crowd")}
              >
                <span>Manage Crowd</span>
                <ArrowRightIcon size={13} />
              </button>
            </div>

            <div className="adm-crowd-cards-list">
              {canteensList.map((c) => (
                <div key={c.id} className="adm-crowd-row-card">
                  <div className="adm-crowd-left">
                    <span className="adm-canteen-name">{c.name}</span>
                    <span className="adm-canteen-sub">{c.status} · ~{c.wait} wait</span>
                  </div>
                  <div className="adm-crowd-right">
                    <span className={`adm-crowd-badge ${c.level.toLowerCase()}`}>
                      {c.level} CROWD
                    </span>
                    <span className="adm-occupancy-tag">{c.people}% full</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right: Low Stock & Expiry Alerts */}
          <section className="adm-card-panel">
            <div className="adm-panel-head">
              <div className="adm-panel-title-wrap">
                <AlertTriangleIcon size={18} color="#D97706" />
                <h2 className="adm-panel-title">Raw Stock & Expiry Alerts</h2>
              </div>
              <button
                type="button"
                className="adm-panel-action-btn"
                onClick={() => onNavigate("admin-stock")}
              >
                <span>Stock Manager</span>
                <ArrowRightIcon size={13} />
              </button>
            </div>

            <div className="adm-stock-alerts-list">
              {alertStocks.map((item, idx) => (
                <div key={idx} className="adm-stock-alert-item">
                  <div className="adm-stock-alert-name-wrap">
                    <span className="adm-alert-bullet" />
                    <span className="adm-stock-name">{item.name}</span>
                  </div>
                  <div className="adm-stock-alert-meta">
                    <span className="adm-stock-qty">{item.qty}</span>
                    <span className={`adm-stock-tag ${item.level}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── 4. Recent Orders Table ──────────────────────────────────────── */}
        <section className="adm-card-panel">
          <div className="adm-panel-head">
            <div className="adm-panel-title-wrap">
              <ClipboardIcon size={18} color="#073B30" />
              <h2 className="adm-panel-title">Recent Kitchen Orders</h2>
            </div>
            <button
              type="button"
              className="adm-panel-action-btn"
              onClick={() => onNavigate("admin-orders")}
            >
              <span>View All Orders</span>
              <ArrowRightIcon size={13} />
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-orders-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Canteen</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord, i) => {
                  const st = getStatusLabel(ord.status ?? 0);
                  const itemsText = (ord.items || [])
                    .map((it) => `${it.qty || 1}× ${it.name}`)
                    .join(", ") || "1× Veg thali";
                  return (
                    <tr key={ord.id || i}>
                      <td>
                        <span className="adm-token-badge">{ord.token || "A-08"}</span>
                      </td>
                      <td>
                        <span className="adm-ord-id">{ord.id}</span>
                      </td>
                      <td>
                        <span className="adm-cust-name">{ord.customer || "Student"}</span>
                      </td>
                      <td>
                        <span className="adm-items-line">{itemsText}</span>
                      </td>
                      <td>
                        <span className="adm-canteen-tag">{ord.canteenName || "CSE Canteen"}</span>
                      </td>
                      <td>
                        <b className="adm-amt">₹{ord.total || 90}</b>
                      </td>
                      <td>
                        <span className={`adm-status-chip ${st.cls}`}>{st.text}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="adm-table-btn"
                          onClick={() => onNavigate("admin-orders")}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
