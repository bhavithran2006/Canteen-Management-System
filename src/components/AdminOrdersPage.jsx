import React, { useState, useMemo } from "react";
import "./AdminOrdersPage.css";

/* ── Inline SVG Icons ─────────────────────────────────────────────────────── */
const SearchIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const FilterIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const ClockIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckCircleIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CloseIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRightIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function AdminOrdersPage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    orderHistory = [],
    setOrderHistory,
    updateOrderStatus,
    lang = "en",
    showAlert,
  } = canteenData;

  const [statusFilter, setStatusFilter] = useState("all"); // "all", "0", "1", "2", "3", "-1"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Baseline seed orders for realistic campus canteen demonstration
  const defaultOrders = useMemo(() => [
    {
      id: "ORD-1577",
      token: "A-54",
      customer: "Ananya Sharma",
      roll: "21CSE045",
      items: [{ id: "veg_thali", name: "Veg Thali", qty: 1, price: 98 }],
      canteenName: "CSE Canteen",
      canteenId: "main",
      issuedTime: new Date(Date.now() - 15 * 60000).toISOString(),
      timeFormatted: "10:24 AM",
      paymentMode: "UPI",
      paymentStatus: "PAID",
      status: 1, // PREPARING
      total: 98,
    },
    {
      id: "ORD-7274",
      token: "A-08",
      customer: "Karthik Raja",
      roll: "22ECE018",
      items: [{ id: "veg_thali", name: "Veg thali", qty: 1, price: 90 }],
      canteenName: "CSE Canteen",
      canteenId: "main",
      issuedTime: new Date(Date.now() - 35 * 60000).toISOString(),
      timeFormatted: "10:05 AM",
      paymentMode: "UPI",
      paymentStatus: "PAID",
      status: 0, // PLACED
      total: 90,
    },
    {
      id: "ORD-9397",
      token: "A-73",
      customer: "Priya Sundar",
      roll: "23IT009",
      items: [
        { id: "veg_thali", name: "Veg thali", qty: 1, price: 90 },
        { id: "masala_chai", name: "Masala Chai", qty: 1, price: 15 },
      ],
      canteenName: "CSE Canteen",
      canteenId: "main",
      issuedTime: new Date(Date.now() - 65 * 60000).toISOString(),
      timeFormatted: "09:30 AM",
      paymentMode: "Card",
      paymentStatus: "PAID",
      status: 1, // PREPARING
      total: 105,
    },
    {
      id: "ORD-6322",
      token: "A-31",
      customer: "Rahul V",
      roll: "21MECH033",
      items: [{ id: "paneer_wrap", name: "Paneer wrap", qty: 2, price: 60 }],
      canteenName: "S&H Canteen",
      canteenId: "law",
      issuedTime: new Date(Date.now() - 90 * 60000).toISOString(),
      timeFormatted: "09:05 AM",
      paymentMode: "Campus Wallet",
      paymentStatus: "PAID",
      status: 2, // READY FOR PICKUP
      total: 120,
    },
    {
      id: "ORD-8480",
      token: "A-71",
      customer: "Deepak S",
      roll: "22CIVIL012",
      items: [{ id: "chicken_biryani", name: "Chicken biryani", qty: 1, price: 130 }],
      canteenName: "Mech Canteen",
      canteenId: "library",
      issuedTime: new Date(Date.now() - 140 * 60000).toISOString(),
      timeFormatted: "08:15 AM",
      paymentMode: "UPI",
      paymentStatus: "PAID",
      status: 3, // COMPLETED
      total: 130,
    },
  ], []);

  // Merge live orders from project context with default seed orders
  const allOrders = useMemo(() => {
    if (orderHistory && orderHistory.length > 0) {
      const existingIds = new Set(orderHistory.map((o) => o.id));
      const filteredDefaults = defaultOrders.filter((d) => !existingIds.has(d.id));
      return [...orderHistory, ...filteredDefaults];
    }
    return defaultOrders;
  }, [orderHistory, defaultOrders]);

  // Status definition map
  const STATUS_CONFIG = {
    0: { label: "PLACED", key: "placed", color: "#B45309", bg: "rgba(245, 184, 0, 0.16)", nextStatus: 1, nextLabel: "Start Prep →" },
    1: { label: "PREPARING", key: "prep", color: "#7C3AED", bg: "rgba(139, 92, 246, 0.16)", nextStatus: 2, nextLabel: "Mark Ready →" },
    2: { label: "READY FOR PICKUP", key: "ready", color: "#059669", bg: "rgba(16, 185, 129, 0.16)", nextStatus: 3, nextLabel: "Confirm Pickup →" },
    3: { label: "COMPLETED", key: "completed", color: "#073B30", bg: "rgba(7, 59, 48, 0.12)", nextStatus: null, nextLabel: null },
    "-1": { label: "CANCELLED", key: "cancelled", color: "#DC2626", bg: "rgba(239, 68, 68, 0.14)", nextStatus: null, nextLabel: null },
  };

  const handleStatusChange = (orderId, nextSt) => {
    if (typeof updateOrderStatus === "function") {
      updateOrderStatus(orderId, nextSt);
    } else if (typeof setOrderHistory === "function") {
      setOrderHistory((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextSt } : o))
      );
    }
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: nextSt }));
    }
    if (typeof showAlert === "function") {
      const cfg = STATUS_CONFIG[nextSt] || {};
      showAlert(`Order ${orderId} updated to ${cfg.label || "Updated"}!`);
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return allOrders.filter((ord) => {
      // Filter by status
      if (statusFilter !== "all" && String(ord.status) !== statusFilter) {
        return false;
      }
      // Filter by search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = (ord.id || "").toLowerCase().includes(q);
        const matchesToken = (ord.token || "").toLowerCase().includes(q);
        const matchesCustomer = (ord.customer || "").toLowerCase().includes(q);
        const matchesItem = (ord.items || []).some((it) => (it.name || "").toLowerCase().includes(q));
        if (!matchesId && !matchesToken && !matchesCustomer && !matchesItem) {
          return false;
        }
      }
      return true;
    });
  }, [allOrders, statusFilter, searchQuery]);

  return (
    <div className="adm-orders-page">
      <div className="adm-orders-container">
        {/* ── Top Header ─────────────────────────────────────────────────── */}
        <div className="adm-orders-header">
          <div>
            <div className="adm-orders-eyebrow">CANTEEN COMMAND CENTER</div>
            <h1 className="adm-orders-title">📋 Live Orders Management</h1>
            <p className="adm-orders-sub">
              Monitor active orders, update preparation stages, and track pickup passes across all campus canteens.
            </p>
          </div>
          <button
            type="button"
            className="adm-qr-shortcut-btn"
            onClick={() => onNavigate("qr-scanner")}
          >
            📱 Open QR Scanner
          </button>
        </div>

        {/* ── Filters & Search Row ────────────────────────────────────────── */}
        <div className="adm-filter-bar">
          <div className="adm-status-tabs">
            <button
              type="button"
              className={`adm-tab-pill ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({allOrders.length})
            </button>
            <button
              type="button"
              className={`adm-tab-pill ${statusFilter === "0" ? "active" : ""}`}
              onClick={() => setStatusFilter("0")}
            >
              Placed ({allOrders.filter((o) => o.status === 0).length})
            </button>
            <button
              type="button"
              className={`adm-tab-pill ${statusFilter === "1" ? "active" : ""}`}
              onClick={() => setStatusFilter("1")}
            >
              Preparing ({allOrders.filter((o) => o.status === 1).length})
            </button>
            <button
              type="button"
              className={`adm-tab-pill ${statusFilter === "2" ? "active" : ""}`}
              onClick={() => setStatusFilter("2")}
            >
              Ready ({allOrders.filter((o) => o.status === 2).length})
            </button>
            <button
              type="button"
              className={`adm-tab-pill ${statusFilter === "3" ? "active" : ""}`}
              onClick={() => setStatusFilter("3")}
            >
              Completed ({allOrders.filter((o) => o.status === 3).length})
            </button>
          </div>

          <div className="adm-search-input-wrap">
            <SearchIcon size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search token, order ID, student, dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="adm-search-input"
            />
          </div>
        </div>

        {/* ── Orders Cards / Grid ─────────────────────────────────────────── */}
        <div className="adm-orders-list">
          {filteredOrders.length === 0 ? (
            <div className="adm-empty-orders">
              <p>No orders found matching the selected filter.</p>
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const st = STATUS_CONFIG[ord.status ?? 0] || STATUS_CONFIG[0];
              const timeString = ord.timeFormatted || (ord.issuedTime ? new Date(ord.issuedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now");
              const itemsList = (ord.items || []).map((it) => `${it.qty || 1}× ${it.name}`).join(", ") || "1× Veg thali";

              return (
                <div key={ord.id} className="adm-order-card">
                  {/* Card Left: Token & Main Details */}
                  <div className="adm-card-primary">
                    <div className="adm-card-header-row">
                      <div className="adm-token-group">
                        <span className="adm-gold-token">{ord.token || "A-00"}</span>
                        <span className="adm-ord-code">{ord.id}</span>
                      </div>
                      <span className="adm-card-canteen">{ord.canteenName || "CSE Canteen"}</span>
                    </div>

                    <div className="adm-card-items-row">
                      <span className="adm-items-bold">{itemsList}</span>
                    </div>

                    <div className="adm-card-meta-line">
                      <span className="adm-customer-label">👤 {ord.customer || "Student"} {ord.roll ? `(${ord.roll})` : ""}</span>
                      <span className="adm-dot">•</span>
                      <span>💳 {ord.paymentMode || "UPI"} ({ord.paymentStatus || "PAID"})</span>
                      <span className="adm-dot">•</span>
                      <span className="adm-time-pill">
                        <ClockIcon size={12} />
                        {timeString}
                      </span>
                    </div>
                  </div>

                  {/* Card Right: Status & Actions */}
                  <div className="adm-card-secondary">
                    <div className="adm-price-status-wrap">
                      <div className="adm-order-total-price">₹{ord.total || 90}</div>
                      <span
                        className="adm-status-badge"
                        style={{ backgroundColor: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>

                    <div className="adm-card-actions">
                      <button
                        type="button"
                        className="adm-details-btn"
                        onClick={() => setSelectedOrder(ord)}
                      >
                        Details & Tracking →
                      </button>

                      {st.nextLabel && (
                        <button
                          type="button"
                          className="adm-primary-advance-btn"
                          onClick={() => handleStatusChange(ord.id, st.nextStatus)}
                        >
                          {st.nextLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Order Details & Tracking Timeline Modal ─────────────────────── */}
      {selectedOrder && (
        <div className="adm-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="adm-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="adm-sheet-head">
              <div>
                <div className="adm-modal-token-pill">{selectedOrder.token}</div>
                <h2 className="adm-sheet-title">Order Details: {selectedOrder.id}</h2>
              </div>
              <button
                type="button"
                className="adm-sheet-close"
                onClick={() => setSelectedOrder(null)}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="adm-sheet-body">
              {/* Complete Tracking Timeline */}
              <div className="adm-timeline-box">
                <div className="adm-timeline-title">ORDER TRACKING TIMELINE</div>
                <div className="adm-tracking-steps">
                  {/* Step 1: PLACED */}
                  <div className={`adm-track-step ${selectedOrder.status >= 0 ? "done" : ""}`}>
                    <div className="adm-step-circle">
                      {selectedOrder.status > 0 ? "✓" : "1"}
                    </div>
                    <div className="adm-step-info">
                      <div className="adm-step-title">ORDER PLACED</div>
                      <div className="adm-step-desc">Received by canteen kitchen</div>
                    </div>
                  </div>

                  <div className="adm-step-line" />

                  {/* Step 2: PREPARING */}
                  <div className={`adm-track-step ${selectedOrder.status >= 1 ? "done active" : ""}`}>
                    <div className="adm-step-circle">
                      {selectedOrder.status > 1 ? "✓" : "2"}
                    </div>
                    <div className="adm-step-info">
                      <div className="adm-step-title">PREPARING</div>
                      <div className="adm-step-desc">Chef actively cooking dish</div>
                    </div>
                  </div>

                  <div className="adm-step-line" />

                  {/* Step 3: READY FOR PICKUP */}
                  <div className={`adm-track-step ${selectedOrder.status >= 2 ? "done active" : ""}`}>
                    <div className="adm-step-circle">
                      {selectedOrder.status > 2 ? "✓" : "3"}
                    </div>
                    <div className="adm-step-info">
                      <div className="adm-step-title">READY FOR PICKUP</div>
                      <div className="adm-step-desc">Counter pickup token: <b>{selectedOrder.token}</b></div>
                    </div>
                  </div>

                  <div className="adm-step-line" />

                  {/* Step 4: COMPLETED */}
                  <div className={`adm-track-step ${selectedOrder.status >= 3 ? "done" : ""}`}>
                    <div className="adm-step-circle">✓</div>
                    <div className="adm-step-info">
                      <div className="adm-step-title">COMPLETED</div>
                      <div className="adm-step-desc">Picked up by student</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Info Breakdown */}
              <div className="adm-detail-grid">
                <div className="adm-detail-col">
                  <span className="adm-col-label">Student / Customer</span>
                  <span className="adm-col-val">{selectedOrder.customer || "Student"}</span>
                  <span className="adm-col-sub">{selectedOrder.roll || "Department CSE"}</span>
                </div>
                <div className="adm-detail-col">
                  <span className="adm-col-label">Canteen Counter</span>
                  <span className="adm-col-val">{selectedOrder.canteenName || "CSE Canteen"}</span>
                  <span className="adm-col-sub">Campus Food Court</span>
                </div>
                <div className="adm-detail-col">
                  <span className="adm-col-label">Payment Status</span>
                  <span className="adm-col-val">{selectedOrder.paymentMode || "UPI"}</span>
                  <span className="adm-col-sub" style={{ color: "#059669" }}>✓ {selectedOrder.paymentStatus || "PAID"}</span>
                </div>
                <div className="adm-detail-col">
                  <span className="adm-col-label">Total Amount</span>
                  <span className="adm-col-val" style={{ color: "#073B30", fontSize: 18 }}>₹{selectedOrder.total || 90}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="adm-sheet-items-card">
                <div className="adm-items-head">Ordered Food Items</div>
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="adm-sheet-item-row">
                    <span><b>{it.qty || 1}×</b> {it.name}</span>
                    <span>₹{(it.price || 90) * (it.qty || 1)}</span>
                  </div>
                ))}
              </div>

              {/* Quick Status Control Buttons */}
              <div className="adm-sheet-status-control">
                <span className="adm-control-label">Update Order Status:</span>
                <div className="adm-control-buttons">
                  <button
                    type="button"
                    className={`adm-stage-btn ${selectedOrder.status === 0 ? "active" : ""}`}
                    onClick={() => handleStatusChange(selectedOrder.id, 0)}
                  >
                    Placed
                  </button>
                  <button
                    type="button"
                    className={`adm-stage-btn ${selectedOrder.status === 1 ? "active" : ""}`}
                    onClick={() => handleStatusChange(selectedOrder.id, 1)}
                  >
                    Preparing
                  </button>
                  <button
                    type="button"
                    className={`adm-stage-btn ${selectedOrder.status === 2 ? "active" : ""}`}
                    onClick={() => handleStatusChange(selectedOrder.id, 2)}
                  >
                    Ready for Pickup
                  </button>
                  <button
                    type="button"
                    className={`adm-stage-btn ${selectedOrder.status === 3 ? "active" : ""}`}
                    onClick={() => handleStatusChange(selectedOrder.id, 3)}
                  >
                    Completed
                  </button>
                  <button
                    type="button"
                    className="adm-stage-btn text-danger"
                    onClick={() => handleStatusChange(selectedOrder.id, -1)}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>

            <div className="adm-sheet-foot">
              <button
                type="button"
                className="adm-close-sheet-btn"
                onClick={() => setSelectedOrder(null)}
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
