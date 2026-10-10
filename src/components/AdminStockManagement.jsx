import React, { useState, useMemo, useEffect } from "react";
import { useCanteen } from "../App.jsx";

/* ── Inline SVG icons ────────────────────────────────────────────── */
const ic = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

const ArrowLeft = ({ size = 18 }) => (
  <svg {...ic(size)}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
);
const Plus = ({ size = 15 }) => (
  <svg {...ic(size)}><path d="M5 12h14M12 5v14" /></svg>
);
const Minus = ({ size = 15 }) => (
  <svg {...ic(size)}><path d="M5 12h14" /></svg>
);
const Search = ({ size = 16 }) => (
  <svg {...ic(size)}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
);
const Filter = ({ size = 16 }) => (
  <svg {...ic(size)}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
);
const AlertCircle = ({ size = 16 }) => (
  <svg {...ic(size)}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
const CheckCircle = ({ size = 16 }) => (
  <svg {...ic(size)}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);
const Clock = ({ size = 16 }) => (
  <svg {...ic(size)}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const HistoryIcon = ({ size = 16 }) => (
  <svg {...ic(size)}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
);
const EditIcon = ({ size = 15 }) => (
  <svg {...ic(size)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const TrashIcon = ({ size = 15 }) => (
  <svg {...ic(size)}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

const CATEGORIES = [
  "All",
  "Grains",
  "Dairy",
  "Vegetables",
  "Meat",
  "Spices",
  "Oils",
  "Bakery",
  "Sweeteners",
  "Other",
];

const UNITS = ["kg", "gram", "litre", "ml", "piece", "packet", "box", "dozen"];

const REDUCE_REASONS = [
  "Food preparation",
  "Damaged",
  "Expired",
  "Wastage",
  "Manual adjustment",
  "Other",
];

export default function AdminStockManagement({ onNavigate }) {
  const {
    user,
    lang,
    t,
    showAlert,
    menu,
    rawStocks,
    stockTransactions,
    recipeIngredients,
    addRawStock,
    updateRawStock,
    deleteRawStock,
    purchaseRawStock,
    reduceRawStock,
    saveRecipeMapping,
    deleteRecipeMapping,
  } = useCanteen();

  // Active view: 'inventory' | 'recipes' | 'history'
  const [activeTab, setActiveTab] = useState("inventory");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // All, IN STOCK, LOW STOCK, OUT OF STOCK, EXPIRED
  const [expiryFilter, setExpiryFilter] = useState("All"); // All, Normal, Expiring Soon, Expired

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [purchaseModalItem, setPurchaseModalItem] = useState(null);
  const [reduceModalItem, setReduceModalItem] = useState(null);
  const [historyFilterItem, setHistoryFilterItem] = useState(null); // When opening history for specific item

  // Form states for Add / Edit
  const [formStock, setFormStock] = useState({
    stockName: "",
    category: "Grains",
    quantity: 0,
    unit: "kg",
    minimumStockLevel: 5,
    purchasePrice: 0,
    supplierName: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });

  // Form states for Purchase
  const [purchaseForm, setPurchaseForm] = useState({
    quantity: "",
    purchasePrice: "",
    supplierName: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    reason: "",
  });

  // Form states for Reduce
  const [reduceForm, setReduceForm] = useState({
    quantity: "",
    reason: "Food preparation",
    notes: "",
  });

  // Recipe Mapping states
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(menu[0]?.id || "veg_thali");
  const [recipeForm, setRecipeForm] = useState({
    stockId: "",
    quantity: "",
    unit: "kg",
    notes: "",
  });
  const [simulationServings, setSimulationServings] = useState(5);

  // History filters
  const [histTypeFilter, setHistTypeFilter] = useState("All");
  const [histSearch, setHistSearch] = useState("");

  // Populate Add/Edit Form
  useEffect(() => {
    if (editingStock) {
      setFormStock({
        stockName: editingStock.stockName || "",
        category: editingStock.category || "Grains",
        quantity: editingStock.quantity || 0,
        unit: editingStock.unit || "kg",
        minimumStockLevel: editingStock.minimumStockLevel || 5,
        purchasePrice: editingStock.purchasePrice || 0,
        supplierName: editingStock.supplierName || "",
        purchaseDate: editingStock.purchaseDate || new Date().toISOString().split("T")[0],
        expiryDate: editingStock.expiryDate || "",
      });
      setShowAddModal(true);
    }
  }, [editingStock]);

  // Helper to compute stock status
  const getStockStatus = (item) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let isExpired = false;
    let isExpiringSoon = false;
    let daysLeft = null;

    if (item.expiryDate) {
      const exp = new Date(item.expiryDate);
      exp.setHours(0, 0, 0, 0);
      daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0) isExpired = true;
      else if (daysLeft <= 7) isExpiringSoon = true;
    }

    let status = "IN STOCK";
    if (isExpired) status = "EXPIRED";
    else if (item.quantity === 0) status = "OUT OF STOCK";
    else if (item.quantity <= item.minimumStockLevel) status = "LOW STOCK";

    return { status, isExpired, isExpiringSoon, daysLeft };
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    const list = rawStocks || [];
    let lowCount = 0;
    let outCount = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;

    for (const item of list) {
      const { status, isExpired, isExpiringSoon } = getStockStatus(item);
      if (isExpired) expiredCount++;
      if (isExpiringSoon) expiringSoonCount++;
      if (status === "OUT OF STOCK") outCount++;
      else if (status === "LOW STOCK") lowCount++;
    }

    return {
      total: list.length,
      lowStock: lowCount,
      outOfStock: outCount,
      expiringSoon: expiringSoonCount,
      expired: expiredCount,
    };
  }, [rawStocks]);

  // Filtered stocks list
  const filteredStocks = useMemo(() => {
    let list = rawStocks || [];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.stockName.toLowerCase().includes(term) ||
          (s.supplierName && s.supplierName.toLowerCase().includes(term)) ||
          (s.stockId && s.stockId.toLowerCase().includes(term))
      );
    }

    if (selectedCat !== "All") {
      list = list.filter((s) => s.category.toLowerCase() === selectedCat.toLowerCase());
    }

    if (statusFilter !== "All") {
      list = list.filter((s) => getStockStatus(s).status === statusFilter);
    }

    if (expiryFilter !== "All") {
      list = list.filter((s) => {
        const { isExpired, isExpiringSoon } = getStockStatus(s);
        if (expiryFilter === "Expired") return isExpired;
        if (expiryFilter === "Expiring Soon") return isExpiringSoon;
        if (expiryFilter === "Normal") return !isExpired && !isExpiringSoon;
        return true;
      });
    }

    return list;
  }, [rawStocks, search, selectedCat, statusFilter, expiryFilter]);

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    let list = stockTransactions || [];

    if (historyFilterItem) {
      list = list.filter(
        (t) =>
          t.stockId === historyFilterItem.id ||
          t.stockName?.toLowerCase() === historyFilterItem.stockName?.toLowerCase()
      );
    }

    if (histTypeFilter !== "All") {
      list = list.filter((t) => t.type === histTypeFilter);
    }

    if (histSearch.trim()) {
      const term = histSearch.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.stockName?.toLowerCase().includes(term) ||
          t.reason?.toLowerCase().includes(term) ||
          t.supplierName?.toLowerCase().includes(term) ||
          t.performedBy?.toLowerCase().includes(term)
      );
    }

    return list;
  }, [stockTransactions, historyFilterItem, histTypeFilter, histSearch]);

  // Current selected dish mapped ingredients
  const currentDishIngredients = useMemo(() => {
    return (recipeIngredients || []).filter((r) => r.menuItemId === selectedMenuItemId);
  }, [recipeIngredients, selectedMenuItemId]);

  // Handle Save Stock (Add or Edit)
  const handleSubmitStock = (e) => {
    e.preventDefault();
    if (!formStock.stockName.trim()) {
      alert("Stock Name is required.");
      return;
    }

    const payload = {
      ...formStock,
      quantity: Number(formStock.quantity) || 0,
      minimumStockLevel: Number(formStock.minimumStockLevel) || 0,
      purchasePrice: Number(formStock.purchasePrice) || 0,
    };

    if (editingStock) {
      updateRawStock(editingStock.id, payload);
      showAlert(
        lang === "ta"
          ? `✅ "${payload.stockName}" இருப்பு புதுப்பிக்கப்பட்டது!`
          : `✅ Stock "${payload.stockName}" updated successfully!`
      );
    } else {
      addRawStock(payload);
      showAlert(
        lang === "ta"
          ? `✅ புதிய மூலப்பொருள் "${payload.stockName}" சேர்க்கப்பட்டது!`
          : `✅ New raw material "${payload.stockName}" added successfully!`
      );
    }

    setShowAddModal(false);
    setEditingStock(null);
  };

  // Handle Purchase Submit
  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    const qty = Number(purchaseForm.quantity);
    if (!qty || qty <= 0) {
      alert("Please enter a valid purchase quantity greater than 0.");
      return;
    }

    purchaseRawStock(purchaseModalItem.id, {
      quantity: qty,
      purchasePrice: Number(purchaseForm.purchasePrice) || purchaseModalItem.purchasePrice,
      supplierName: purchaseForm.supplierName || purchaseModalItem.supplierName,
      purchaseDate: purchaseForm.purchaseDate,
      expiryDate: purchaseForm.expiryDate || purchaseModalItem.expiryDate,
      reason: purchaseForm.reason || `Purchased ${qty} ${purchaseModalItem.unit}`,
    });

    showAlert(
      lang === "ta"
        ? `✅ +${qty} ${purchaseModalItem.unit} "${purchaseModalItem.stockName}" வாங்கப்பட்டு இருப்பு உயர்த்தப்பட்டது!`
        : `✅ Purchased +${qty} ${purchaseModalItem.unit} for "${purchaseModalItem.stockName}"!`
    );

    setPurchaseModalItem(null);
    setPurchaseForm({
      quantity: "",
      purchasePrice: "",
      supplierName: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      reason: "",
    });
  };

  // Handle Reduce Submit
  const handleReduceSubmit = (e) => {
    e.preventDefault();
    const qty = Number(reduceForm.quantity);
    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }

    if (qty > purchaseModalItem?.quantity && reduceModalItem) {
      if (qty > reduceModalItem.quantity) {
        alert(
          `Insufficient stock. Only ${reduceModalItem.quantity} ${reduceModalItem.unit} of ${reduceModalItem.stockName} is available.`
        );
        return;
      }
    }

    const result = reduceRawStock(reduceModalItem.id, {
      quantity: qty,
      reason: reduceForm.reason,
      notes: reduceForm.notes,
    });

    if (result && result.error) {
      alert(result.error);
      return;
    }

    showAlert(
      lang === "ta"
        ? `📉 -${qty} ${reduceModalItem.unit} "${reduceModalItem.stockName}" குறைக்கப்பட்டது (${reduceForm.reason})`
        : `📉 Reduced -${qty} ${reduceModalItem.unit} from "${reduceModalItem.stockName}" (${reduceForm.reason})`
    );

    setReduceModalItem(null);
    setReduceForm({
      quantity: "",
      reason: "Food preparation",
      notes: "",
    });
  };

  // Handle Add Recipe Ingredient
  const handleAddRecipeIngredient = (e) => {
    e.preventDefault();
    if (!recipeForm.stockId) {
      alert("Please choose a stock raw material.");
      return;
    }
    const qty = Number(recipeForm.quantity);
    if (!qty || qty <= 0) {
      alert("Please enter a valid ingredient quantity per serving.");
      return;
    }

    const targetStock = rawStocks.find((s) => String(s.id) === String(recipeForm.stockId));
    saveRecipeMapping({
      menuItemId: selectedMenuItemId,
      stockId: Number(recipeForm.stockId),
      quantity: qty,
      unit: recipeForm.unit || targetStock?.unit || "kg",
      notes: recipeForm.notes || "",
    });

    showAlert(
      lang === "ta"
        ? `🍽️ "${targetStock?.stockName}" உணவு தயாரிப்புடன் இணைக்கப்பட்டது!`
        : `🍽️ Mapped "${targetStock?.stockName}" to dish recipe!`
    );

    setRecipeForm({
      stockId: "",
      quantity: "",
      unit: "kg",
      notes: "",
    });
  };

  const getStatusBadge = (statusObj) => {
    const { status, isExpiringSoon } = statusObj;
    if (status === "EXPIRED") {
      return <span className="stk-badge stk-badge-expired">⛔ EXPIRED</span>;
    }
    if (status === "OUT OF STOCK") {
      return <span className="stk-badge stk-badge-out">🔴 OUT OF STOCK</span>;
    }
    if (status === "LOW STOCK") {
      return <span className="stk-badge stk-badge-low">⚠️ LOW STOCK</span>;
    }
    if (isExpiringSoon) {
      return <span className="stk-badge stk-badge-soon">⏳ EXPIRING SOON</span>;
    }
    return <span className="stk-badge stk-badge-in">✅ IN STOCK</span>;
  };

  return (
    <div className="admin-stock-container">
      {/* ── Page Header Banner ────────────────────────────────────── */}
      <div className="admin-header-banner stk-banner">
        <div className="admin-banner-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <button
              className="back stk-back-btn"
              onClick={() => onNavigate("admin-dashboard")}
              title="Return to Admin Dashboard"
            >
              <ArrowLeft />
            </button>
            <div className="admin-badge-top">
              🌾 {lang === "ta" ? "உணவக நிர்வாகம் · இருப்பு மேலாண்மை" : "CANTEEN ADMIN · RAW STOCK SYSTEM"}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="admin-banner-title">
                {lang === "ta" ? "மூலப்பொருள் இருப்பு மேலாண்மை" : "Raw Material Stock Management"}
              </h1>
              <p className="admin-banner-sub">
                {lang === "ta"
                  ? "சமையல் மூலப்பொருட்கள், கொள்முதல் விலை, பயன்பாட்டு வரலாறு மற்றும் உணவு செய்முறை மேப்பிங்."
                  : "Manage kitchen raw materials, outside supplier purchases, wastage logs & recipe deductions."}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="stk-cta-btn"
                onClick={() => {
                  setEditingStock(null);
                  setFormStock({
                    stockName: "",
                    category: "Grains",
                    quantity: 0,
                    unit: "kg",
                    minimumStockLevel: 5,
                    purchasePrice: 0,
                    supplierName: "",
                    purchaseDate: new Date().toISOString().split("T")[0],
                    expiryDate: "",
                  });
                  setShowAddModal(true);
                }}
              >
                <Plus size={16} />
                {lang === "ta" ? "புதிய மூலப்பொருள் சேர்க்க" : "Add New Stock Item"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 20 }}>
        {/* ── Summary KPI Cards (Requirement 11) ────────────────────── */}
        <div className="stk-kpi-grid">
          <div
            className={`stk-kpi-card ${statusFilter === "All" ? "active" : ""}`}
            onClick={() => { setStatusFilter("All"); setExpiryFilter("All"); }}
          >
            <div className="stk-kpi-header">
              <span className="stk-kpi-title">{lang === "ta" ? "மொத்த இருப்பு பொருட்கள்" : "Total Stock Items"}</span>
              <span className="stk-kpi-icon" style={{ background: "rgba(226,163,16,0.15)", color: "var(--coral-d)" }}>📦</span>
            </div>
            <div className="stk-kpi-num">{kpis.total}</div>
            <div className="stk-kpi-desc">{lang === "ta" ? "கண்காணிக்கப்படும் பொருட்கள்" : "Tracked raw ingredients"}</div>
          </div>

          <div
            className={`stk-kpi-card ${statusFilter === "LOW STOCK" ? "active" : ""}`}
            onClick={() => { setStatusFilter("LOW STOCK"); setExpiryFilter("All"); }}
          >
            <div className="stk-kpi-header">
              <span className="stk-kpi-title">{lang === "ta" ? "குறைந்த இருப்பு" : "Low Stock Items"}</span>
              <span className="stk-kpi-icon" style={{ background: "rgba(204,122,0,0.15)", color: "var(--amber)" }}>⚠️</span>
            </div>
            <div className="stk-kpi-num" style={{ color: "var(--amber)" }}>{kpis.lowStock}</div>
            <div className="stk-kpi-desc">{lang === "ta" ? "குறைந்தபட்ச அளவிற்கு கீழ்" : "Below minimum threshold"}</div>
          </div>

          <div
            className={`stk-kpi-card ${statusFilter === "OUT OF STOCK" ? "active" : ""}`}
            onClick={() => { setStatusFilter("OUT OF STOCK"); setExpiryFilter("All"); }}
          >
            <div className="stk-kpi-header">
              <span className="stk-kpi-title">{lang === "ta" ? "காலி இருப்பு" : "Out of Stock"}</span>
              <span className="stk-kpi-icon" style={{ background: "rgba(196,62,28,0.15)", color: "var(--rose)" }}>🔴</span>
            </div>
            <div className="stk-kpi-num" style={{ color: "var(--rose)" }}>{kpis.outOfStock}</div>
            <div className="stk-kpi-desc">{lang === "ta" ? "உடனடி கொள்முதல் தேவை" : "Zero quantity remaining"}</div>
          </div>

          <div
            className={`stk-kpi-card ${expiryFilter === "Expiring Soon" ? "active" : ""}`}
            onClick={() => { setExpiryFilter("Expiring Soon"); setStatusFilter("All"); }}
          >
            <div className="stk-kpi-header">
              <span className="stk-kpi-title">{lang === "ta" ? "விரைவில் காலாவதி" : "Expiring Soon"}</span>
              <span className="stk-kpi-icon" style={{ background: "rgba(234,88,12,0.15)", color: "#ea580c" }}>⏳</span>
            </div>
            <div className="stk-kpi-num" style={{ color: "#ea580c" }}>{kpis.expiringSoon}</div>
            <div className="stk-kpi-desc">{lang === "ta" ? "7 நாட்களுக்குள் காலாவதி" : "Expires in ≤ 7 days"}</div>
          </div>

          <div
            className={`stk-kpi-card ${expiryFilter === "Expired" ? "active" : ""}`}
            onClick={() => { setExpiryFilter("Expired"); setStatusFilter("All"); }}
          >
            <div className="stk-kpi-header">
              <span className="stk-kpi-title">{lang === "ta" ? "காலாவதியானவை" : "Expired Items"}</span>
              <span className="stk-kpi-icon" style={{ background: "rgba(153,27,27,0.15)", color: "#991b1b" }}>⛔</span>
            </div>
            <div className="stk-kpi-num" style={{ color: "#991b1b" }}>{kpis.expired}</div>
            <div className="stk-kpi-desc">{lang === "ta" ? "அகற்றப்பட வேண்டியவை" : "Discard or replace"}</div>
          </div>
        </div>

        {/* ── View Navigation Tabs ─────────────────────────────────── */}
        <div className="stk-tabs-row">
          <button
            className={`stk-tab-btn ${activeTab === "inventory" ? "active" : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            📦 {lang === "ta" ? "மூலப்பொருள் இருப்புப் பட்டியல்" : "Stock Inventory & Actions"} ({filteredStocks.length})
          </button>
          <button
            className={`stk-tab-btn ${activeTab === "recipes" ? "active" : ""}`}
            onClick={() => setActiveTab("recipes")}
          >
            🍽️ {lang === "ta" ? "உணவு செய்முறை மூலப்பொருள் மேப்பிங்" : "Recipe Ingredient Mapping"}
          </button>
          <button
            className={`stk-tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => { setActiveTab("history"); setHistoryFilterItem(null); }}
          >
            📜 {lang === "ta" ? "இருப்பு பரிவர்த்தனை வரலாறு" : "Stock Transaction History"} ({stockTransactions?.length || 0})
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* TAB 1: STOCK INVENTORY VIEW                                   */}
        {/* ════════════════════════════════════════════════════════════ */}
        {activeTab === "inventory" && (
          <div className="stk-view-section">
            {/* Search and Filter Controls */}
            <div className="stk-filter-bar">
              <div className="stk-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={lang === "ta" ? "பொருளின் பெயர் அல்லது சப்ளையர் தேட..." : "Search stock item or supplier..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="stk-clear-btn" onClick={() => setSearch("")}>✕</button>
                )}
              </div>

              <div className="stk-filters-group">
                <select
                  className="stk-select"
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? (lang === "ta" ? "அனைத்து பிரிவுகள்" : "All Categories") : cat}
                    </option>
                  ))}
                </select>

                <select
                  className="stk-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">{lang === "ta" ? "அனைத்து நிலைகள்" : "All Stock Statuses"}</option>
                  <option value="IN STOCK">IN STOCK</option>
                  <option value="LOW STOCK">LOW STOCK</option>
                  <option value="OUT OF STOCK">OUT OF STOCK</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>

                <select
                  className="stk-select"
                  value={expiryFilter}
                  onChange={(e) => setExpiryFilter(e.target.value)}
                >
                  <option value="All">{lang === "ta" ? "அனைத்து காலாவதி நிலைகள்" : "All Expiry Statuses"}</option>
                  <option value="Normal">Normal</option>
                  <option value="Expiring Soon">Expiring Soon (≤ 7 days)</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            {filteredStocks.length === 0 ? (
              <div className="card empty-state stk-empty-state">
                <div style={{ fontSize: 36, marginBottom: 8 }}>🌾</div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>
                  {lang === "ta" ? "பொருட்கள் எதுவும் கிடைக்கவில்லை" : "No stock items match your search/filter."}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                  {lang === "ta" ? "தேடல் வடிப்பான்களை மாற்றவும் அல்லது புதிய பொருளை சேர்க்கவும்." : "Try adjusting your filters or click Add New Stock Item."}
                </div>
              </div>
            ) : (
              <div className="stk-table-card">
                <div className="stk-table-wrapper">
                  <table className="stk-table">
                    <thead>
                      <tr>
                        <th>{lang === "ta" ? "பொருள் பெயர்" : "Stock Item"}</th>
                        <th>{lang === "ta" ? "பிரிவு" : "Category"}</th>
                        <th>{lang === "ta" ? "இருப்பு அளவு" : "Available Qty"}</th>
                        <th>{lang === "ta" ? "குறைந்தபட்ச அளவு" : "Min. Level"}</th>
                        <th>{lang === "ta" ? "கொள்முதல் விலை" : "Purchase Price"}</th>
                        <th>{lang === "ta" ? "சப்ளையர்" : "Supplier"}</th>
                        <th>{lang === "ta" ? "காலாவதி தேதி" : "Expiry Date"}</th>
                        <th>{lang === "ta" ? "நிலை" : "Status"}</th>
                        <th style={{ textAlign: "right" }}>{lang === "ta" ? "செயல்கள்" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStocks.map((item) => {
                        const statusObj = getStockStatus(item);
                        const pct = Math.min(100, Math.round((item.quantity / (item.minimumStockLevel * 2 || 1)) * 100));

                        return (
                          <tr key={item.id} className={statusObj.status === "EXPIRED" ? "row-expired" : ""}>
                            <td>
                              <div className="stk-item-cell">
                                <div className="stk-item-name">{item.stockName}</div>
                                <div className="stk-item-id">{item.stockId || `STK-${item.id}`}</div>
                              </div>
                            </td>
                            <td>
                              <span className="stk-cat-pill">{item.category}</span>
                            </td>
                            <td>
                              <div className="stk-qty-cell">
                                <div className="stk-qty-num">
                                  <b>{item.quantity}</b> <span className="muted small">{item.unit}</span>
                                </div>
                                <div className="stk-progress-bar">
                                  <div
                                    className={`stk-progress-fill ${statusObj.status.toLowerCase().replace(" ", "-")}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="stk-min-level">{item.minimumStockLevel} {item.unit}</span>
                            </td>
                            <td>
                              <b>₹{item.purchasePrice || 0}</b>
                            </td>
                            <td>
                              <span className="stk-supplier-text">{item.supplierName || "—"}</span>
                            </td>
                            <td>
                              {item.expiryDate ? (
                                <div className="stk-expiry-cell">
                                  <div>{item.expiryDate}</div>
                                  {statusObj.isExpired ? (
                                    <span className="badge-micro-expired">Expired</span>
                                  ) : statusObj.isExpiringSoon ? (
                                    <span className="badge-micro-soon">{statusObj.daysLeft}d left</span>
                                  ) : null}
                                </div>
                              ) : (
                                <span className="muted">—</span>
                              )}
                            </td>
                            <td>
                              {getStatusBadge(statusObj)}
                            </td>
                            <td>
                              <div className="stk-actions-cell">
                                <button
                                  className="stk-btn-action stk-btn-add"
                                  onClick={() => {
                                    setPurchaseModalItem(item);
                                    setPurchaseForm({
                                      quantity: "",
                                      purchasePrice: item.purchasePrice || "",
                                      supplierName: item.supplierName || "",
                                      purchaseDate: new Date().toISOString().split("T")[0],
                                      expiryDate: item.expiryDate || "",
                                      reason: "",
                                    });
                                  }}
                                  title="Purchase / Add Stock"
                                >
                                  <Plus size={13} /> {lang === "ta" ? "வாங்க" : "+ Add"}
                                </button>

                                <button
                                  className="stk-btn-action stk-btn-reduce"
                                  onClick={() => {
                                    setReduceModalItem(item);
                                    setReduceForm({
                                      quantity: "",
                                      reason: "Food preparation",
                                      notes: "",
                                    });
                                  }}
                                  title="Reduce Stock"
                                >
                                  <Minus size={13} /> {lang === "ta" ? "குறைக்க" : "- Reduce"}
                                </button>

                                <button
                                  className="stk-btn-icon"
                                  onClick={() => {
                                    setEditingStock(item);
                                  }}
                                  title="Edit Stock Details"
                                >
                                  <EditIcon size={14} />
                                </button>

                                <button
                                  className="stk-btn-icon"
                                  onClick={() => {
                                    setHistoryFilterItem(item);
                                    setActiveTab("history");
                                  }}
                                  title="View Item History"
                                >
                                  <HistoryIcon size={14} />
                                </button>

                                <button
                                  className="stk-btn-icon danger"
                                  onClick={() => {
                                    if (window.confirm(`Delete "${item.stockName}" from stock inventory?`)) {
                                      deleteRawStock(item.id);
                                    }
                                  }}
                                  title="Delete Item"
                                >
                                  <TrashIcon size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* TAB 2: RECIPE INGREDIENT MAPPING VIEW (Requirement 12 & 13)    */}
        {/* ════════════════════════════════════════════════════════════ */}
        {activeTab === "recipes" && (
          <div className="stk-view-section">
            <div className="stk-recipe-layout">
              {/* Dish Selector Column */}
              <div className="stk-recipe-dishes-col">
                <div className="section-subtitle">
                  🍽️ {lang === "ta" ? "உணவு வகையை தேர்ந்தெடுக்கவும்" : "Select Canteen Menu Dish"}
                </div>
                <div className="stk-dishes-list">
                  {menu.map((dish) => {
                    const count = (recipeIngredients || []).filter((r) => r.menuItemId === dish.id).length;
                    const isSelected = selectedMenuItemId === dish.id;

                    return (
                      <div
                        key={dish.id}
                        className={`stk-dish-item ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedMenuItemId(dish.id)}
                      >
                        <div>
                          <div className="stk-dish-name">
                            {lang === "ta" ? (dish.name_ta || dish.name) : dish.name}
                          </div>
                          <div className="stk-dish-meta">
                            ₹{dish.price} · {dish.category}
                          </div>
                        </div>
                        <span className="stk-dish-badge">
                          {count} {lang === "ta" ? "மூலப்பொருட்கள்" : "ingredients"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mapped Ingredients & Add Form Column */}
              <div className="stk-recipe-content-col">
                {(() => {
                  const currentDish = menu.find((d) => d.id === selectedMenuItemId) || menu[0];

                  return (
                    <>
                      <div className="stk-dish-detail-header">
                        <div>
                          <h2 className="stk-dish-detail-title">
                            {lang === "ta" ? (currentDish.name_ta || currentDish.name) : currentDish.name}
                          </h2>
                          <p className="stk-dish-detail-sub">
                            {lang === "ta"
                              ? "ஒரு தட்டு உணவு தயாரிப்பதற்கு தேவையான மூலப்பொருள் அளவுகளை உள்ளமைக்கவும்."
                              : "Configure raw ingredients required per 1 serving of this dish."}
                          </p>
                        </div>
                        <div className="stk-dish-detail-price">₹{currentDish.price}</div>
                      </div>

                      {/* List of currently mapped ingredients */}
                      <div className="stk-mapped-ingredients-box">
                        <div className="section-subtitle" style={{ marginBottom: 12 }}>
                          📋 {lang === "ta" ? "இணைக்கப்பட்ட மூலப்பொருட்கள் (1 சேவைக்கு)" : "Ingredients Required (Per 1 Serving)"}
                        </div>

                        {currentDishIngredients.length === 0 ? (
                          <div className="stk-recipe-empty">
                            <div>⚠️ {lang === "ta" ? "இந்த உணவிற்கு மூலப்பொருட்கள் இன்னும் இணைக்கப்படவில்லை." : "No raw materials mapped to this dish yet."}</div>
                            <div className="small muted">
                              {lang === "ta" ? "கீழே உள்ள படிவத்தைப் பயன்படுத்தி மூலப்பொருளை இணைக்கவும்." : "Use the form below to add ingredients for automatic deduction."}
                            </div>
                          </div>
                        ) : (
                          <div className="stk-recipe-ingredients-list">
                            {currentDishIngredients.map((ing) => {
                              const stock = rawStocks.find((s) => String(s.id) === String(ing.stockId));
                              return (
                                <div key={ing.id} className="stk-recipe-ing-card">
                                  <div className="stk-recipe-ing-info">
                                    <div className="stk-recipe-ing-name">
                                      {stock?.stockName || `Stock #${ing.stockId}`}
                                    </div>
                                    <div className="stk-recipe-ing-qty">
                                      <b>{ing.quantity} {ing.unit}</b>
                                      {stock && (
                                        <span className="muted small">
                                          {" "}(Available in pantry: {stock.quantity} {stock.unit})
                                        </span>
                                      )}
                                    </div>
                                    {ing.notes && <div className="stk-recipe-ing-notes">{ing.notes}</div>}
                                  </div>

                                  <button
                                    className="stk-btn-icon danger"
                                    onClick={() => deleteRecipeMapping(ing.id)}
                                    title="Remove Ingredient from Recipe"
                                  >
                                    <TrashIcon size={14} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Form to Map a New Ingredient */}
                      <div className="stk-add-ingredient-form-card">
                        <div className="section-subtitle" style={{ marginBottom: 12 }}>
                          ➕ {lang === "ta" ? "புதிய மூலப்பொருள் சேர்க்க" : "Add Ingredient to this Recipe"}
                        </div>

                        <form onSubmit={handleAddRecipeIngredient} className="stk-form-grid">
                          <div className="stk-form-group" style={{ gridColumn: "span 2" }}>
                            <label>{lang === "ta" ? "மூலப்பொருள் தேர்வு செய்க" : "Select Raw Material"}</label>
                            <select
                              className="stk-input"
                              value={recipeForm.stockId}
                              onChange={(e) => {
                                const selected = rawStocks.find((s) => String(s.id) === e.target.value);
                                setRecipeForm({
                                  ...recipeForm,
                                  stockId: e.target.value,
                                  unit: selected ? selected.unit : recipeForm.unit,
                                });
                              }}
                              required
                            >
                              <option value="">{lang === "ta" ? "-- மூலப்பொருள் தேர்ந்தெடுக்கவும் --" : "-- Choose Stock Item --"}</option>
                              {rawStocks.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.stockName} ({s.quantity} {s.unit} available) - {s.category}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="stk-form-group">
                            <label>{lang === "ta" ? "தேவையான அளவு (1 தட்டுக்கு)" : "Qty Required (Per 1 Serving)"}</label>
                            <input
                              type="number"
                              step="0.001"
                              className="stk-input"
                              placeholder="e.g. 0.25"
                              value={recipeForm.quantity}
                              onChange={(e) => setRecipeForm({ ...recipeForm, quantity: e.target.value })}
                              required
                            />
                          </div>

                          <div className="stk-form-group">
                            <label>{lang === "ta" ? "அலகு (Unit)" : "Unit"}</label>
                            <select
                              className="stk-input"
                              value={recipeForm.unit}
                              onChange={(e) => setRecipeForm({ ...recipeForm, unit: e.target.value })}
                            >
                              {UNITS.map((u) => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          </div>

                          <div className="stk-form-group" style={{ gridColumn: "span 2" }}>
                            <label>{lang === "ta" ? "குறிப்பு (விரும்பினால்)" : "Preparation Notes (Optional)"}</label>
                            <input
                              type="text"
                              className="stk-input"
                              placeholder="e.g. Basmati rice, chopped onions"
                              value={recipeForm.notes}
                              onChange={(e) => setRecipeForm({ ...recipeForm, notes: e.target.value })}
                            />
                          </div>

                          <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end" }}>
                            <button type="submit" className="stk-cta-btn">
                              <Plus size={15} /> {lang === "ta" ? "செய்முறையில் இணைக்க" : "Save Ingredient Mapping"}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Serving Deduction Simulator (Requirement 12) */}
                      {currentDishIngredients.length > 0 && (
                        <div className="stk-simulator-card">
                          <div className="section-subtitle" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>🧮 {lang === "ta" ? "ஆர்டர் தானியங்கி இருப்பு கழித்தல் கணக்கீடு" : "Order Automatic Deduction Simulator"}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <label style={{ fontSize: 12, margin: 0 }}>Servings:</label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                className="stk-input"
                                style={{ width: 70, padding: "4px 8px" }}
                                value={simulationServings}
                                onChange={(e) => setSimulationServings(Math.max(1, Number(e.target.value) || 1))}
                              />
                            </div>
                          </div>

                          <div className="stk-simulator-results">
                            <div style={{ fontSize: 13, color: "var(--ink)", marginBottom: 8 }}>
                              When a customer orders <b>{simulationServings}× {currentDish.name}</b>, kitchen confirmation will automatically deduct:
                            </div>
                            <div className="stk-sim-pills">
                              {currentDishIngredients.map((ing) => {
                                const stock = rawStocks.find((s) => String(s.id) === String(ing.stockId));
                                const totalNeeded = Math.round(ing.quantity * simulationServings * 1000) / 1000;
                                const isEnough = (stock?.quantity ?? 0) >= totalNeeded;

                                return (
                                  <div
                                    key={ing.id}
                                    className={`stk-sim-pill ${isEnough ? "ok" : "short"}`}
                                  >
                                    <span className="name">{stock?.stockName || "Ingredient"}:</span>
                                    <b> {totalNeeded} {ing.unit}</b>
                                    <span className="status-label">
                                      {isEnough ? ` (Available: ${stock?.quantity} ${stock?.unit} ✅)` : ` (SHORT! Only ${stock?.quantity} ${stock?.unit} ❌)`}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* TAB 3: TRANSACTION HISTORY VIEW (Requirement 8)               */}
        {/* ════════════════════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <div className="stk-view-section">
            {/* History Filter Bar */}
            <div className="stk-filter-bar">
              <div className="stk-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={lang === "ta" ? "பொருள், காரணம், பயனர் தேட..." : "Search history by item, reason, user..."}
                  value={histSearch}
                  onChange={(e) => setHistSearch(e.target.value)}
                />
                {histSearch && (
                  <button className="stk-clear-btn" onClick={() => setHistSearch("")}>✕</button>
                )}
              </div>

              <div className="stk-filters-group">
                <select
                  className="stk-select"
                  value={histTypeFilter}
                  onChange={(e) => setHistTypeFilter(e.target.value)}
                >
                  <option value="All">{lang === "ta" ? "அனைத்து வகைகள்" : "All Transaction Types"}</option>
                  <option value="PURCHASE">PURCHASE (+)</option>
                  <option value="FOOD_PREPARATION">FOOD_PREPARATION (-)</option>
                  <option value="USED">USED (-)</option>
                  <option value="WASTAGE">WASTAGE (-)</option>
                  <option value="DAMAGED">DAMAGED (-)</option>
                  <option value="EXPIRED">EXPIRED (-)</option>
                  <option value="ADJUSTMENT">ADJUSTMENT</option>
                  <option value="RETURN">RETURN</option>
                </select>

                {historyFilterItem && (
                  <button
                    className="chip active"
                    onClick={() => setHistoryFilterItem(null)}
                    title="Click to show all items"
                  >
                    Item: {historyFilterItem.stockName} ✕
                  </button>
                )}
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="card empty-state stk-empty-state">
                <div style={{ fontSize: 36, marginBottom: 8 }}>📜</div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>
                  {lang === "ta" ? "பரிவர்த்தனை வரலாறு எதுவும் கிடைக்கவில்லை" : "No stock transaction records found."}
                </div>
              </div>
            ) : (
              <div className="stk-table-card">
                <div className="stk-table-wrapper">
                  <table className="stk-table">
                    <thead>
                      <tr>
                        <th>{lang === "ta" ? "தேதி / நேரம்" : "Date & Time"}</th>
                        <th>{lang === "ta" ? "பொருள்" : "Stock Item"}</th>
                        <th>{lang === "ta" ? "வகை" : "Type"}</th>
                        <th>{lang === "ta" ? "அளவு மாற்றம்" : "Qty Change"}</th>
                        <th>{lang === "ta" ? "முந்தைய இருப்பு" : "Previous"}</th>
                        <th>{lang === "ta" ? "புதிய இருப்பு" : "New Stock"}</th>
                        <th>{lang === "ta" ? "காரணம் / குறிப்பு" : "Reason / Order Ref"}</th>
                        <th>{lang === "ta" ? "சப்ளையர்" : "Supplier"}</th>
                        <th>{lang === "ta" ? "செய்தவர்" : "User / Admin"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx, idx) => {
                        const isPositive = tx.quantity > 0 || tx.type === "PURCHASE";
                        const formattedDate = new Date(tx.date || tx.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        });

                        return (
                          <tr key={tx.id || idx}>
                            <td>
                              <span className="mono small">{formattedDate}</span>
                            </td>
                            <td>
                              <b>{tx.stockName}</b>
                            </td>
                            <td>
                              <span className={`tx-badge tx-${(tx.type || "").toLowerCase()}`}>
                                {tx.type}
                              </span>
                            </td>
                            <td>
                              <span className={`tx-qty ${isPositive ? "pos" : "neg"}`}>
                                {isPositive ? `+${tx.quantity}` : tx.quantity} {tx.unit}
                              </span>
                            </td>
                            <td>
                              <span className="muted">{tx.previousStock} {tx.unit}</span>
                            </td>
                            <td>
                              <b>{tx.newStock} {tx.unit}</b>
                            </td>
                            <td>
                              <span className="stk-reason-text">{tx.reason || "—"}</span>
                              {tx.orderId && <span className="stk-order-badge">#{tx.orderId}</span>}
                            </td>
                            <td>
                              <span className="muted">{tx.supplierName || "—"}</span>
                            </td>
                            <td>
                              <span className="stk-user-tag">{tx.performedBy || "Admin"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: ADD / EDIT STOCK ITEM                                 */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="ref-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="ref-modal stk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ref-modal-header">
              <div className="ref-modal-title">
                {editingStock
                  ? (lang === "ta" ? "✏️ மூலப்பொருள் திருத்து" : "✏️ Edit Stock Item")
                  : (lang === "ta" ? "➕ புதிய மூலப்பொருள் சேர்க்க" : "➕ Add New Stock Raw Material")}
              </div>
              <button className="ref-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitStock} className="stk-form-grid">
              <div className="stk-form-group">
                <label>{lang === "ta" ? "பொருளின் பெயர் *" : "Stock Name *"}</label>
                <input
                  type="text"
                  className="stk-input"
                  placeholder="e.g. Rice, Milk, Tomato"
                  value={formStock.stockName}
                  onChange={(e) => setFormStock({ ...formStock, stockName: e.target.value })}
                  required
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "பிரிவு *" : "Category *"}</label>
                <select
                  className="stk-input"
                  value={formStock.category}
                  onChange={(e) => setFormStock({ ...formStock, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="stk-form-group">
                <label>
                  {editingStock
                    ? (lang === "ta" ? "தற்போதைய இருப்பு அளவு *" : "Current Quantity *")
                    : (lang === "ta" ? "ஆரம்ப இருப்பு அளவு *" : "Initial Quantity *")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="stk-input"
                  placeholder="0"
                  value={formStock.quantity}
                  onChange={(e) => setFormStock({ ...formStock, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "அலகு (Unit) *" : "Unit *"}</label>
                <select
                  className="stk-input"
                  value={formStock.unit}
                  onChange={(e) => setFormStock({ ...formStock, unit: e.target.value })}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "குறைந்தபட்ச இருப்பு எச்சரிக்கை அளவு *" : "Minimum Stock Level *"}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="stk-input"
                  placeholder="e.g. 10"
                  value={formStock.minimumStockLevel}
                  onChange={(e) => setFormStock({ ...formStock, minimumStockLevel: e.target.value })}
                  required
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "கொள்முதல் விலை (₹)" : "Purchase Price (₹)"}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="stk-input"
                  placeholder="₹ 0"
                  value={formStock.purchasePrice}
                  onChange={(e) => setFormStock({ ...formStock, purchasePrice: e.target.value })}
                />
              </div>

              <div className="stk-form-group" style={{ gridColumn: "span 2" }}>
                <label>{lang === "ta" ? "சப்ளையர் பெயர்" : "Supplier Name"}</label>
                <input
                  type="text"
                  className="stk-input"
                  placeholder="e.g. ABC Suppliers, Fresh Farms"
                  value={formStock.supplierName}
                  onChange={(e) => setFormStock({ ...formStock, supplierName: e.target.value })}
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "கொள்முதல் தேதி" : "Purchase Date"}</label>
                <input
                  type="date"
                  className="stk-input"
                  value={formStock.purchaseDate}
                  onChange={(e) => setFormStock({ ...formStock, purchaseDate: e.target.value })}
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "காலாவதி தேதி (விரும்பினால்)" : "Expiry Date (Optional)"}</label>
                <input
                  type="date"
                  className="stk-input"
                  value={formStock.expiryDate}
                  onChange={(e) => setFormStock({ ...formStock, expiryDate: e.target.value })}
                />
              </div>

              <div className="stk-modal-actions" style={{ gridColumn: "span 2" }}>
                <button type="button" className="ref-modal-dismiss-btn" onClick={() => setShowAddModal(false)}>
                  {lang === "ta" ? "ரத்து" : "Cancel"}
                </button>
                <button type="submit" className="stk-cta-btn">
                  {editingStock ? (lang === "ta" ? "மாற்றங்களை சேமி" : "Save Changes") : (lang === "ta" ? "பொருளை சேமிக்க" : "Add Stock Item")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: PURCHASE / ADD QUANTITY MODAL (Requirement 6)         */}
      {/* ════════════════════════════════════════════════════════════ */}
      {purchaseModalItem && (
        <div className="ref-modal-backdrop" onClick={() => setPurchaseModalItem(null)}>
          <div className="ref-modal stk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ref-modal-header">
              <div className="ref-modal-title">
                📥 {lang === "ta" ? "கூடுதல் இருப்பு வாங்க / சேர்க்க" : "Purchase & Add Stock"}
              </div>
              <button className="ref-modal-close" onClick={() => setPurchaseModalItem(null)}>✕</button>
            </div>

            <div className="stk-modal-item-summary">
              <div>
                <div className="item-name">{purchaseModalItem.stockName}</div>
                <div className="item-sub">Current Stock: <b>{purchaseModalItem.quantity} {purchaseModalItem.unit}</b> · Category: {purchaseModalItem.category}</div>
              </div>
              <span className="stk-badge stk-badge-in">AVAILABLE: {purchaseModalItem.quantity} {purchaseModalItem.unit}</span>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="stk-form-grid">
              <div className="stk-form-group">
                <label>{lang === "ta" ? "வாங்கப்பட்ட அளவு *" : `Quantity to Add (${purchaseModalItem.unit}) *`}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="stk-input"
                  placeholder="e.g. 50"
                  value={purchaseForm.quantity}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "மொத்த கொள்முதல் விலை (₹)" : "Total Purchase Price (₹)"}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="stk-input"
                  placeholder="e.g. 2500"
                  value={purchaseForm.purchasePrice}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, purchasePrice: e.target.value })}
                />
              </div>

              <div className="stk-form-group" style={{ gridColumn: "span 2" }}>
                <label>{lang === "ta" ? "சப்ளையர் பெயர்" : "Supplier Name"}</label>
                <input
                  type="text"
                  className="stk-input"
                  placeholder="e.g. ABC Suppliers"
                  value={purchaseForm.supplierName}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, supplierName: e.target.value })}
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "கொள்முதல் தேதி" : "Purchase Date"}</label>
                <input
                  type="date"
                  className="stk-input"
                  value={purchaseForm.purchaseDate}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, purchaseDate: e.target.value })}
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "புதிய காலாவதி தேதி" : "Batch Expiry Date"}</label>
                <input
                  type="date"
                  className="stk-input"
                  value={purchaseForm.expiryDate}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, expiryDate: e.target.value })}
                />
              </div>

              <div className="stk-form-group" style={{ gridColumn: "span 2" }}>
                <label>{lang === "ta" ? "காரணம் / விலைப்பட்டியல் எண்" : "Purchase Notes / Invoice Ref"}</label>
                <input
                  type="text"
                  className="stk-input"
                  placeholder="e.g. Bulk monthly delivery INV-9821"
                  value={purchaseForm.reason}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, reason: e.target.value })}
                />
              </div>

              {/* Dynamic preview */}
              {purchaseForm.quantity > 0 && (
                <div className="stk-calc-preview" style={{ gridColumn: "span 2" }}>
                  <div>Previous Stock: <b>{purchaseModalItem.quantity} {purchaseModalItem.unit}</b></div>
                  <div>Purchase: <b style={{ color: "var(--emerald)" }}>+{purchaseForm.quantity} {purchaseModalItem.unit}</b></div>
                  <div style={{ marginTop: 4, fontWeight: 800 }}>
                    New Total Stock: {Math.round((purchaseModalItem.quantity + Number(purchaseForm.quantity)) * 100) / 100} {purchaseModalItem.unit}
                  </div>
                </div>
              )}

              <div className="stk-modal-actions" style={{ gridColumn: "span 2" }}>
                <button type="button" className="ref-modal-dismiss-btn" onClick={() => setPurchaseModalItem(null)}>
                  {lang === "ta" ? "ரத்து" : "Cancel"}
                </button>
                <button type="submit" className="stk-cta-btn" style={{ background: "var(--emerald)" }}>
                  <Plus size={15} /> {lang === "ta" ? "இருப்பில் சேர்க்க" : "Confirm Purchase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL 3: REDUCE STOCK MODAL (Requirement 7 & 16)               */}
      {/* ════════════════════════════════════════════════════════════ */}
      {reduceModalItem && (
        <div className="ref-modal-backdrop" onClick={() => setReduceModalItem(null)}>
          <div className="ref-modal stk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ref-modal-header">
              <div className="ref-modal-title">
                📉 {lang === "ta" ? "இருப்பு குறைப்பு பதிவு" : "Record Stock Reduction"}
              </div>
              <button className="ref-modal-close" onClick={() => setReduceModalItem(null)}>✕</button>
            </div>

            <div className="stk-modal-item-summary">
              <div>
                <div className="item-name">{reduceModalItem.stockName}</div>
                <div className="item-sub">Available Stock: <b>{reduceModalItem.quantity} {reduceModalItem.unit}</b></div>
              </div>
              <span className="stk-badge stk-badge-in">{reduceModalItem.quantity} {reduceModalItem.unit}</span>
            </div>

            <form onSubmit={handleReduceSubmit} className="stk-form-grid">
              <div className="stk-form-group">
                <label>{lang === "ta" ? "குறைக்க வேண்டிய அளவு *" : `Quantity to Deduct (${reduceModalItem.unit}) *`}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={reduceModalItem.quantity}
                  className="stk-input"
                  placeholder={`Max: ${reduceModalItem.quantity}`}
                  value={reduceForm.quantity}
                  onChange={(e) => setReduceForm({ ...reduceForm, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="stk-form-group">
                <label>{lang === "ta" ? "குறைப்புக்கான காரணம் *" : "Reason for Reduction *"}</label>
                <select
                  className="stk-input"
                  value={reduceForm.reason}
                  onChange={(e) => setReduceForm({ ...reduceForm, reason: e.target.value })}
                >
                  {REDUCE_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="stk-form-group" style={{ gridColumn: "span 2" }}>
                <label>{lang === "ta" ? "விளக்கம் / குறிப்பு (விரும்பினால்)" : "Detailed Notes / Explanation (Optional)"}</label>
                <input
                  type="text"
                  className="stk-input"
                  placeholder="e.g. Prepared 25 servings of veg thali, or spoiled milk container"
                  value={reduceForm.notes}
                  onChange={(e) => setReduceForm({ ...reduceForm, notes: e.target.value })}
                />
              </div>

              {/* Real-time deduction preview */}
              {reduceForm.quantity > 0 && (
                <div className="stk-calc-preview" style={{ gridColumn: "span 2" }}>
                  <div>Previous Stock: <b>{reduceModalItem.quantity} {reduceModalItem.unit}</b></div>
                  <div>Deduction: <b style={{ color: "var(--rose)" }}>-{reduceForm.quantity} {reduceModalItem.unit}</b></div>
                  <div style={{ marginTop: 4, fontWeight: 800 }}>
                    Remaining Stock: {Math.max(0, Math.round((reduceModalItem.quantity - Number(reduceForm.quantity)) * 100) / 100)} {reduceModalItem.unit}
                  </div>
                  {Number(reduceForm.quantity) > reduceModalItem.quantity && (
                    <div style={{ color: "var(--rose)", fontWeight: 700, marginTop: 4 }}>
                      ⚠️ Insufficient stock! Cannot reduce more than {reduceModalItem.quantity} {reduceModalItem.unit}.
                    </div>
                  )}
                </div>
              )}

              <div className="stk-modal-actions" style={{ gridColumn: "span 2" }}>
                <button type="button" className="ref-modal-dismiss-btn" onClick={() => setReduceModalItem(null)}>
                  {lang === "ta" ? "ரத்து" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="stk-cta-btn"
                  style={{ background: "var(--rose)" }}
                  disabled={Number(reduceForm.quantity) > reduceModalItem.quantity}
                >
                  <Minus size={15} /> {lang === "ta" ? "குறைப்பை உறுதிசெய்" : "Confirm Stock Reduction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
