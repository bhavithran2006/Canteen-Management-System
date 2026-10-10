import React, { useState, useRef, useEffect } from "react";
import "./RefactoredTopNav.css";

// ── Icons for Navigation ───────────────────────────────────────────────────
const ForkKnifeNavIcon = ({ size = 16, color = "#1a1a1a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v20M21 2v4a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V2" />
    <path d="M3 2v7c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2M5 11v11" />
  </svg>
);

const HomeNavIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CartNavIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const UsersNavIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const StarNavIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TruckNavIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

const OrdersNavIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

const StockNavIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const MenuNavIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4V2M4 18h16a1 1 0 0 0 1-1c0-4.97-4.03-9-9-9s-9 4.03-9 9a1 1 0 0 0 1 1z" />
    <line x1="2" y1="21" x2="22" y2="21" />
  </svg>
);

const ChefAiNavIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <circle cx="9" cy="13" r="1.5" fill={color} />
    <circle cx="15" cy="13" r="1.5" fill={color} />
    <path d="M9 17h6" />
    <path d="M12 4v4" />
    <circle cx="12" cy="3" r="1" fill={color} />
  </svg>
);

const DashboardNavIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const QrScannerNavIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="6" height="6" rx="1.5" />
    <rect x="15" y="3" width="6" height="6" rx="1.5" />
    <rect x="3" y="15" width="6" height="6" rx="1.5" />
    <path d="M15 15h2v2h-2z" />
    <path d="M19 15h2v6h-6v-2h4v-4z" />
    <path d="M15 19h2v2h-2z" />
  </svg>
);

const MoonNavIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const SunNavIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const LogoutNavIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const UserNavIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
  </svg>
);

const ChevronDownIcon = ({ size = 11, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function RefactoredTopNav({
  page,
  onNavigate,
  theme,
  toggleTheme,
  onOpenChat,
  useCanteenHook,
}) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const { user, setUser, logout, cart = {}, lang, toggleLang } = canteenData;
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setProfileOpen(false);
    if (typeof logout === "function") {
      logout();
    } else {
      if (setUser) setUser(null);
      try {
        sessionStorage.removeItem("canteen_session_user");
        localStorage.removeItem("canteen_current_user");
      } catch (e) {}
    }
    onNavigate("login");
  };

  // Admin detection: user.role is admin OR current page is an admin-specific page
  const isAdmin =
    user?.role === "admin" ||
    page.startsWith("admin") ||
    page === "kitchen-orders" ||
    page === "qr-scanner";

  // Calculate cart total items for student badge
  const totalCartCount = Object.values(cart || {}).reduce((acc, qty) => acc + (Number(qty) || 0), 0);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="ref-nav-header">
      <div className="ref-nav-container">
        {/* ── LEFT: Logo & Role Pill ─────────────────────── */}
        <div className="ref-nav-left">
          {/* Logo */}
          <div
            className="ref-nav-brand"
            onClick={() => onNavigate(isAdmin ? "admin-dashboard" : "home")}
            role="button"
            tabIndex={0}
          >
            <div className="ref-brand-icon">
              <ForkKnifeNavIcon size={16} color="#1a1a1a" />
            </div>
            <div className="ref-brand-text">
              <span className="brand-campus">Campus</span>{" "}
              <span className="brand-canteen">Canteen</span>
            </div>
          </div>

          {/* Role Pill Dropdown Trigger */}
          <div className="ref-profile-wrap" ref={dropdownRef}>
            <button
              type="button"
              className={`ref-role-pill ${isAdmin ? "is-admin" : "is-student"}`}
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <UserNavIcon size={13} color={isAdmin ? "#F5B800" : "#4ade80"} />
              <span className="role-text">{isAdmin ? "ADMIN" : "STUDENT"}</span>
              <ChevronDownIcon size={11} color={isAdmin ? "#F5B800" : "#4ade80"} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="ref-profile-dropdown">
                <div className="ref-drop-user-info">
                  <div className="ref-drop-name">{user?.name || (isAdmin ? "Canteen Administrator" : "Student User")}</div>
                  <div className="ref-drop-email">{user?.email || (isAdmin ? "admin@canteen.edu" : "student@campus.edu")}</div>
                  <div className="ref-drop-sub">
                    {isAdmin ? "🛡️ Management Access" : `🎓 ${user?.dept || "CSE"} · Year ${user?.year || "3"}`}
                  </div>
                </div>
                <div className="ref-drop-divider" />

                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      className="ref-drop-item"
                      onClick={() => {
                        setProfileOpen(false);
                        onNavigate("admin-dashboard");
                      }}
                    >
                      <DashboardNavIcon size={14} color="#073B30" />
                      <span>Admin Dashboard</span>
                    </button>
                    <button
                      type="button"
                      className="ref-drop-item"
                      onClick={() => {
                        setProfileOpen(false);
                        onNavigate("admin-home");
                      }}
                    >
                      <HomeNavIcon size={14} color="#073B30" />
                      <span>Admin Overview</span>
                    </button>
                    <button
                      type="button"
                      className="ref-drop-item"
                      onClick={() => {
                        setProfileOpen(false);
                        onNavigate("admin-orders");
                      }}
                    >
                      <OrdersNavIcon size={14} color="#073B30" />
                      <span>Live Kitchen Orders</span>
                    </button>
                    <button
                      type="button"
                      className="ref-drop-item"
                      onClick={() => {
                        setProfileOpen(false);
                        onNavigate("qr-scanner");
                      }}
                    >
                      <QrScannerNavIcon size={14} color="#073B30" />
                      <span>QR Staff Scanner</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="ref-drop-item"
                      onClick={() => {
                        setProfileOpen(false);
                        onNavigate("home");
                      }}
                    >
                      <HomeNavIcon size={14} />
                      <span>Student Home</span>
                    </button>
                    <button
                      type="button"
                      className="ref-drop-item"
                      onClick={() => {
                        setProfileOpen(false);
                        onNavigate("tracking");
                      }}
                    >
                      <TruckNavIcon size={14} />
                      <span>My Active Orders</span>
                    </button>
                  </>
                )}

                <div className="ref-drop-divider" />
                {/* Easy role switch for pair programming & testing */}
                <button
                  type="button"
                  className="ref-drop-item"
                  onClick={() => {
                    setProfileOpen(false);
                    if (typeof setUser === "function") {
                      if (isAdmin) {
                        setUser({ name: "Ananya Sharma", roll: "21CSE045", dept: "CSE", year: 3, role: "customer" });
                        onNavigate("home");
                      } else {
                        setUser({ id: "STAFF-01", name: "Canteen Manager", email: "admin@canteen.edu", role: "admin", dept: "Management", year: 0 });
                        onNavigate("admin-dashboard");
                      }
                    } else {
                      onNavigate(isAdmin ? "home" : "admin-dashboard");
                    }
                  }}
                >
                  <span>🔄 {isAdmin ? "Switch to Student View" : "Switch to Admin View"}</span>
                </button>

                <button
                  type="button"
                  className="ref-drop-item"
                  onClick={() => {
                    setProfileOpen(false);
                    if (toggleLang) toggleLang();
                  }}
                >
                  <span>🌐 {lang === "en" ? "தமிழ் (Switch to Tamil)" : "English (Switch to EN)"}</span>
                </button>

                <div className="ref-drop-divider" />
                <button
                  type="button"
                  className="ref-drop-item text-danger"
                  onClick={handleLogout}
                >
                  <LogoutNavIcon size={14} color="#ef4444" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── CENTER: Navigation Options (Admin vs Student Clean Separation) ── */}
        <nav className="ref-nav-center">
          {isAdmin ? (
            /* ========================================================== */
            /* ADMIN SPECIFIC NAVBAR:                                     */
            /* 🏠 Home, 📋 Orders, 👥 Crowd, 📦 Stock, 🍱 Menu,           */
            /* 📱 QR Scanner, 🤖 Chef AI, 📊 Dashboard (Golden yellow)    */
            /* (No Cart, No Student Feedback, No Student Track!)          */
            /* ========================================================== */
            <>
              {/* 1. Admin Home */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "admin-home" ? "active-pill" : ""}`}
                onClick={() => onNavigate("admin-home")}
              >
                <HomeNavIcon size={15} color={page === "admin-home" ? "#1a1a1a" : "currentColor"} />
                <span>Home</span>
              </button>

              {/* 2. Orders */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "admin-orders" || page === "kitchen-orders" ? "active-pill" : ""}`}
                onClick={() => onNavigate("admin-orders")}
              >
                <OrdersNavIcon size={15} color={page === "admin-orders" || page === "kitchen-orders" ? "#1a1a1a" : "currentColor"} />
                <span>Orders</span>
              </button>

              {/* 3. Crowd */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "admin-crowd" ? "active-pill" : ""}`}
                onClick={() => onNavigate("admin-crowd")}
              >
                <UsersNavIcon size={15} color={page === "admin-crowd" ? "#1a1a1a" : "currentColor"} />
                <span>Crowd</span>
              </button>

              {/* 4. Stock */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "admin-stock" ? "active-pill" : ""}`}
                onClick={() => onNavigate("admin-stock")}
              >
                <StockNavIcon size={15} color={page === "admin-stock" ? "#1a1a1a" : "currentColor"} />
                <span>Stock</span>
              </button>

              {/* 5. Menu */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "admin-menu" ? "active-pill" : ""}`}
                onClick={() => onNavigate("admin-menu")}
              >
                <MenuNavIcon size={15} color={page === "admin-menu" ? "#1a1a1a" : "currentColor"} />
                <span>Menu</span>
              </button>

              {/* 6. QR Scanner */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "qr-scanner" ? "active-pill" : ""}`}
                onClick={() => onNavigate("qr-scanner")}
              >
                <QrScannerNavIcon size={15} color={page === "qr-scanner" ? "#1a1a1a" : "currentColor"} />
                <span>QR Scanner</span>
              </button>

              {/* 7. Chef AI */}
              <button
                type="button"
                className="ref-nav-btn ref-chef-btn"
                onClick={onOpenChat}
                title="Chat with Campus Chef AI"
              >
                <ChefAiNavIcon size={15} color="currentColor" />
                <span>Chef AI</span>
              </button>

              {/* 8. Dashboard (Golden yellow pill highlighted) */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "admin-dashboard" ? "active-pill" : ""}`}
                onClick={() => onNavigate("admin-dashboard")}
              >
                <DashboardNavIcon size={15} color={page === "admin-dashboard" ? "#1a1a1a" : "currentColor"} />
                <span>Dashboard</span>
              </button>
            </>
          ) : (
            /* ========================================================== */
            /* STUDENT SPECIFIC NAVBAR:                                   */
            /* Home, Order, Crowd, Feedback, Cart, Track, Chef AI         */
            /* ========================================================== */
            <>
              {/* 1. Home */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "home" ? "active-pill" : ""}`}
                onClick={() => onNavigate("home")}
              >
                <HomeNavIcon size={15} color={page === "home" ? "#1a1a1a" : "currentColor"} />
                <span>Home</span>
              </button>

              {/* 2. Order */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "menu" || page === "order" ? "active-pill" : ""}`}
                onClick={() => onNavigate("order")}
              >
                <ForkKnifeNavIcon size={15} color={page === "menu" || page === "order" ? "#1a1a1a" : "currentColor"} />
                <span>Order</span>
              </button>

              {/* 3. Crowd */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "crowd" ? "active-pill" : ""}`}
                onClick={() => onNavigate("crowd")}
              >
                <UsersNavIcon size={15} color={page === "crowd" ? "#1a1a1a" : "currentColor"} />
                <span>Crowd</span>
              </button>

              {/* 4. Feedback */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "feedback" ? "active-pill" : ""}`}
                onClick={() => onNavigate("feedback")}
              >
                <StarNavIcon size={15} color={page === "feedback" ? "#1a1a1a" : "currentColor"} />
                <span>Feedback</span>
              </button>

              {/* 5. Cart */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "cart" ? "active-pill" : ""}`}
                onClick={() => onNavigate("cart")}
              >
                <CartNavIcon size={15} color={page === "cart" ? "#1a1a1a" : "currentColor"} />
                <span>Cart</span>
                {totalCartCount > 0 && <span className="ref-cart-badge">{totalCartCount}</span>}
              </button>

              {/* 6. Track */}
              <button
                type="button"
                className={`ref-nav-btn ${page === "tracking" ? "active-pill" : ""}`}
                onClick={() => onNavigate("tracking")}
              >
                <TruckNavIcon size={15} color={page === "tracking" ? "#1a1a1a" : "currentColor"} />
                <span>Track</span>
              </button>

              {/* 7. Chef AI */}
              <button
                type="button"
                className="ref-nav-btn ref-chef-btn"
                onClick={onOpenChat}
                title="Chat with Campus Chef AI"
              >
                <ChefAiNavIcon size={15} color="currentColor" />
                <span>Chef AI</span>
              </button>
            </>
          )}
        </nav>

        {/* ── RIGHT: Dark Mode Toggle & Logout ─────────── */}
        <div className="ref-nav-right">
          {/* Dark Mode toggle */}
          <button
            type="button"
            className="ref-outline-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <>
                <SunNavIcon size={14} color="#f5b738" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <MoonNavIcon size={14} color="#ffffff" />
                <span>Dark mode</span>
              </>
            )}
          </button>

          {/* Logout button */}
          <button
            type="button"
            className="ref-outline-btn"
            onClick={handleLogout}
            title="Logout of account"
          >
            <LogoutNavIcon size={14} color="#ffffff" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
