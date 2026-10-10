import React, { useState, useMemo } from "react";
import "./AdminMenuPage.css";

/* ── Inline SVG Icons ─────────────────────────────────────────────────────── */
const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const EditIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

const CloseIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "meals", label: "Food / Meals" },
  { id: "juice", label: "Fresh Juice" },
  { id: "snacks", label: "Snacks" },
  { id: "beverages", label: "Beverages" },
  { id: "desserts", label: "Desserts" },
];

export default function AdminMenuPage({ onNavigate, useCanteenHook }) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    menu = [],
    addProduct,
    updateProduct,
    removeProduct,
    updateStock,
    lang = "en",
    showAlert,
  } = canteenData;

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [currentItem, setCurrentItem] = useState({
    id: "",
    name: "",
    name_ta: "",
    category: "meals",
    price: 60,
    stock: 25,
    available: true,
    veg: true,
    desc: "",
    cal: "250 kcal",
    protein: "8g P",
    carbs: "35g C",
    fat: "6g F",
  });

  // Filtered menu
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (item.name || "").toLowerCase().includes(q);
        const matchesTa = (item.name_ta || "").toLowerCase().includes(q);
        const matchesDesc = (item.desc || "").toLowerCase().includes(q);
        if (!matchesName && !matchesTa && !matchesDesc) return false;
      }
      return true;
    });
  }, [menu, activeCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setCurrentItem({
      id: "dish_" + Date.now(),
      name: "",
      name_ta: "",
      category: activeCategory !== "all" ? activeCategory : "meals",
      price: 50,
      stock: 30,
      available: true,
      veg: true,
      desc: "",
      cal: "150 kcal",
      protein: "5g P",
      carbs: "20g C",
      fat: "4g F",
    });
    setModalMode("add");
  };

  const handleOpenEditModal = (item) => {
    setCurrentItem({ ...item });
    setModalMode("edit");
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!currentItem.name.trim()) {
      alert("Please enter dish name.");
      return;
    }

    const payload = {
      ...currentItem,
      price: Math.max(1, Number(currentItem.price) || 50),
      stock: Math.max(0, Number(currentItem.stock) || 0),
      available: Boolean(currentItem.available && Number(currentItem.stock) > 0),
    };

    if (modalMode === "add") {
      if (typeof addProduct === "function") {
        addProduct(payload);
      }
    } else if (modalMode === "edit") {
      if (typeof updateProduct === "function") {
        updateProduct(payload);
      } else if (typeof updateStock === "function") {
        updateStock(payload.id, payload.stock);
      }
    }
    setModalMode(null);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) {
      if (typeof removeProduct === "function") {
        removeProduct(item.id);
      }
    }
  };

  const handleQuickStock = (id, delta, currentStock) => {
    const next = Math.max(0, (currentStock || 0) + delta);
    if (typeof updateStock === "function") {
      updateStock(id, next);
    }
  };

  const handleToggleAvailability = (item) => {
    const nextAvail = !item.available;
    const nextStock = nextAvail ? Math.max(5, item.stock || 5) : 0;
    if (typeof updateProduct === "function") {
      updateProduct({ ...item, available: nextAvail, stock: nextStock });
    } else if (typeof updateStock === "function") {
      updateStock(item.id, nextStock);
    }
  };

  return (
    <div className="adm-menu-page">
      <div className="adm-menu-container">
        {/* ── Header Row ─────────────────────────────────────────────────── */}
        <div className="adm-menu-header">
          <div>
            <div className="adm-menu-eyebrow">CANTEEN INVENTORY CONTROL</div>
            <h1 className="adm-menu-title">🍱 Menu & Cooked Dishes Manager</h1>
            <p className="adm-menu-sub">
              Add new food items, adjust meal pricing, update live dish stock counters, and manage dining categories.
            </p>
          </div>
          <button
            type="button"
            className="adm-add-dish-btn"
            onClick={handleOpenAddModal}
          >
            <PlusIcon size={16} />
            <span>Add Food Item</span>
          </button>
        </div>

        {/* ── Category Filters & Search ───────────────────────────────────── */}
        <div className="adm-menu-controls">
          <div className="adm-cat-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`adm-cat-pill ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="adm-menu-search-wrap">
            <SearchIcon size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search dishes by name or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="adm-menu-search-input"
            />
          </div>
        </div>

        {/* ── Menu Items Grid ─────────────────────────────────────────────── */}
        <div className="adm-menu-grid">
          {filteredMenu.length === 0 ? (
            <div className="adm-empty-menu">
              <p>No dishes found matching the current search / category filter.</p>
              <button type="button" className="adm-add-inline-btn" onClick={handleOpenAddModal}>
                + Add Dish Now
              </button>
            </div>
          ) : (
            filteredMenu.map((item) => {
              const isLowStock = item.stock > 0 && item.stock <= 5;
              const isOutOfStock = (item.stock || 0) === 0 || !item.available;

              return (
                <div key={item.id} className={`adm-dish-card ${isOutOfStock ? "out-of-stock" : ""}`}>
                  <div className="adm-dish-top">
                    <div className="adm-dish-cat-wrap">
                      <span className="adm-dish-cat-tag">
                        {CATEGORIES.find((c) => c.id === item.category)?.label || item.category}
                      </span>
                      <span className={`adm-veg-indicator ${item.veg !== false ? "veg" : "non-veg"}`}>
                        {item.veg !== false ? "🟢 Veg" : "🔴 Non-Veg"}
                      </span>
                    </div>

                    <div className="adm-dish-actions">
                      <button
                        type="button"
                        className="adm-icon-btn edit"
                        title="Edit dish"
                        onClick={() => handleOpenEditModal(item)}
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        type="button"
                        className="adm-icon-btn delete"
                        title="Delete dish"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="adm-dish-body">
                    <h3 className="adm-dish-name">
                      {item.name}
                      {item.name_ta && <span className="adm-dish-ta">({item.name_ta})</span>}
                    </h3>
                    <p className="adm-dish-desc">{item.desc || "Prepared fresh daily with premium campus ingredients."}</p>

                    {item.cal && (
                      <div className="adm-dish-nutrition-chips">
                        <span className="adm-nutri-chip cal">{item.cal}</span>
                        {item.protein && <span className="adm-nutri-chip pro">{item.protein}</span>}
                        {item.carbs && <span className="adm-nutri-chip carb">{item.carbs}</span>}
                      </div>
                    )}
                  </div>

                  <div className="adm-dish-footer">
                    <div className="adm-price-tag">₹{item.price}</div>

                    {/* Stock Controller */}
                    <div className="adm-stock-counter-wrap">
                      <span className="adm-stock-label">Stock:</span>
                      <div className="adm-stock-stepper">
                        <button
                          type="button"
                          className="adm-step-btn"
                          onClick={() => handleQuickStock(item.id, -1, item.stock)}
                          disabled={(item.stock || 0) <= 0}
                        >
                          -
                        </button>
                        <span className={`adm-stock-val ${isLowStock ? "low" : ""} ${isOutOfStock ? "out" : ""}`}>
                          {item.stock || 0}
                        </span>
                        <button
                          type="button"
                          className="adm-step-btn"
                          onClick={() => handleQuickStock(item.id, 5, item.stock)}
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    {/* Available Toggle */}
                    <button
                      type="button"
                      className={`adm-avail-toggle ${item.available && (item.stock || 0) > 0 ? "active" : "inactive"}`}
                      onClick={() => handleToggleAvailability(item)}
                    >
                      {item.available && (item.stock || 0) > 0 ? "✓ In Stock" : "✕ Sold Out"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Add / Edit Dish Modal ───────────────────────────────────────── */}
      {modalMode && (
        <div className="adm-modal-backdrop" onClick={() => setModalMode(null)}>
          <div className="adm-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="adm-sheet-head">
              <h2 className="adm-sheet-title">
                {modalMode === "add" ? "✨ Add New Food Item" : "✏️ Edit Food Item"}
              </h2>
              <button
                type="button"
                className="adm-sheet-close"
                onClick={() => setModalMode(null)}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="adm-dish-form">
              <div className="adm-form-row">
                <div className="adm-form-field">
                  <label className="adm-form-label">Dish Name (English) *</label>
                  <input
                    type="text"
                    required
                    className="adm-form-input"
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    placeholder="e.g. Masala Dosa"
                  />
                </div>
                <div className="adm-form-field">
                  <label className="adm-form-label">Dish Name (Tamil / தமிழ்)</label>
                  <input
                    type="text"
                    className="adm-form-input"
                    value={currentItem.name_ta || ""}
                    onChange={(e) => setCurrentItem({ ...currentItem, name_ta: e.target.value })}
                    placeholder="எ.கா. மசாலா தோசை"
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-form-field">
                  <label className="adm-form-label">Category *</label>
                  <select
                    className="adm-form-select"
                    value={currentItem.category}
                    onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                  >
                    <option value="meals">Food / Meals</option>
                    <option value="juice">Fresh Juice</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>

                <div className="adm-form-field">
                  <label className="adm-form-label">Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="adm-form-input"
                    value={currentItem.price}
                    onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                  />
                </div>

                <div className="adm-form-field">
                  <label className="adm-form-label">Initial Stock Count *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="adm-form-input"
                    value={currentItem.stock}
                    onChange={(e) => setCurrentItem({ ...currentItem, stock: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="adm-form-field">
                <label className="adm-form-label">Food Description</label>
                <textarea
                  className="adm-form-textarea"
                  rows={2}
                  value={currentItem.desc || ""}
                  onChange={(e) => setCurrentItem({ ...currentItem, desc: e.target.value })}
                  placeholder="Short appetizing description for students..."
                />
              </div>

              <div className="adm-form-row">
                <div className="adm-form-field">
                  <label className="adm-form-label">Dietary Type</label>
                  <div className="adm-radio-group">
                    <label className="adm-radio-label">
                      <input
                        type="radio"
                        name="dietary"
                        checked={currentItem.veg !== false}
                        onChange={() => setCurrentItem({ ...currentItem, veg: true })}
                      />
                      <span>🟢 Pure Vegetarian</span>
                    </label>
                    <label className="adm-radio-label">
                      <input
                        type="radio"
                        name="dietary"
                        checked={currentItem.veg === false}
                        onChange={() => setCurrentItem({ ...currentItem, veg: false })}
                      />
                      <span>🔴 Non-Vegetarian</span>
                    </label>
                  </div>
                </div>

                <div className="adm-form-field">
                  <label className="adm-form-label">Estimated Calories</label>
                  <input
                    type="text"
                    className="adm-form-input"
                    value={currentItem.cal || ""}
                    onChange={(e) => setCurrentItem({ ...currentItem, cal: e.target.value })}
                    placeholder="e.g. 180 kcal"
                  />
                </div>
              </div>

              <div className="adm-modal-form-actions">
                <button
                  type="button"
                  className="adm-cancel-modal-btn"
                  onClick={() => setModalMode(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-submit-dish-btn">
                  {modalMode === "add" ? "Add to Canteen Menu" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
