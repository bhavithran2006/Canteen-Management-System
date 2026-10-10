import React, { useState, useMemo } from "react";
import heroBannerImg from "../assets/order-hero-banner.png";
import vegThaliImg from "../assets/dish_veg_thali.jpg";
import chickenBiryaniImg from "../assets/dish_chicken_biryani.jpg";
import orangeJuiceImg from "../assets/dish_orange_juice.jpg";
import mangoJuiceImg from "../assets/dish_mango_juice.jpg";
import watermelonJuiceImg from "../assets/dish_watermelon_juice.jpg";
import limeMintImg from "../assets/dish_lime_mint.jpg";
import paneerWrapImg from "../assets/dish_paneer_wrap.jpg";
import masalaChaiImg from "../assets/dish_masala_chai.jpg";
import filterCoffeeImg from "../assets/dish_filter_coffee.jpg";
import brownieImg from "../assets/dish_brownie.jpg";
import "./RefactoredOrderPage.css";

// Category SVG Icons
const MealsIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v20M21 2v4a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V2" />
    <path d="M3 2v7c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2M5 11v11" />
  </svg>
);

const JuiceIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 21h10a2 2 0 0 0 2-2L21 8H3l2 11a2 2 0 0 0 2 2Z" />
    <path d="M6 8l1-5h4" />
    <line x1="3" y1="8" x2="21" y2="8" />
  </svg>
);

const SnacksIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-10 18h20L12 3Z" />
    <line x1="12" y1="9" x2="12" y2="15" />
  </svg>
);

const BeveragesIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);

const DessertsIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
    <path d="M2 21h20" />
    <path d="M7 8v3" />
    <path d="M12 8v3" />
    <path d="M17 8v3" />
  </svg>
);

const LeafIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </svg>
);

const MeatIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 8c-2 0-3.5 1-4.5 2-1.5-1.5-3-2-5-2-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.1V21h4v-1.9c.7.2 1.3.3 2 .3 4.4 0 8-3.6 8-8 0-.9-.2-1.8-.5-2.5" />
  </svg>
);

const ArrowLeftIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const PlusIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const InfoIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const AlertTriangleIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TrashIcon = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// High-resolution photography assets mapping
const DISH_IMAGE_MAP = {
  veg_thali: vegThaliImg,
  chicken_biryani: chickenBiryaniImg,
  orange_juice: orangeJuiceImg,
  mango_juice: mangoJuiceImg,
  watermelon_juice: watermelonJuiceImg,
  lime_mint: limeMintImg,
  paneer_wrap: paneerWrapImg,
  masala_chai: masalaChaiImg,
  filter_coffee: filterCoffeeImg,
  brownie: brownieImg,
};

const CATEGORY_TABS = [
  { id: "meals", label: "Food (Meals)", labelTa: "உணவு (மீல்ஸ்)", Icon: MealsIcon },
  { id: "juice", label: "Fresh Juice", labelTa: "புதிய ஜூஸ்", Icon: JuiceIcon },
  { id: "snacks", label: "Snacks", labelTa: "சிற்றுண்டிகள்", Icon: SnacksIcon },
  { id: "beverages", label: "Beverages", labelTa: "பானங்கள்", Icon: BeveragesIcon },
  { id: "desserts", label: "Desserts", labelTa: "இனிப்புகள்", Icon: DessertsIcon },
];

export default function RefactoredOrderPage({
  onNavigate,
  useCanteenHook,
  NutritionModal,
  AddProductCard,
}) {
  const canteenData = typeof useCanteenHook === "function" ? useCanteenHook() : {};
  const {
    user,
    cart = {},
    cartCount = 0,
    cartTotal = 0,
    addToCart,
    setQty,
    menu = [],
    removeProduct,
    lang = "en",
    t = (k) => k,
    lowStockItems = [],
  } = canteenData;

  const isAdmin = user?.role === "admin";
  const [category, setCategory] = useState("meals");
  const [nutritionItem, setNutritionItem] = useState(null);

  // Filter items by category
  const filtered = useMemo(() => {
    return menu.filter((m) => m.category === category);
  }, [menu, category]);

  // Helper to resolve dish image
  const getDishImage = (item) => {
    if (DISH_IMAGE_MAP[item.id]) return DISH_IMAGE_MAP[item.id];
    if (item.image && typeof item.image === "string" && !item.image.includes("blob:")) return item.image;
    if (item.category === "meals") return vegThaliImg;
    if (item.category === "juice") return orangeJuiceImg;
    if (item.category === "snacks") return paneerWrapImg;
    if (item.category === "beverages") return masalaChaiImg;
    if (item.category === "desserts") return brownieImg;
    return vegThaliImg;
  };

  return (
    <div className="ref-order-container ref-order-page">

      {/* 1. HERO BANNER - Exact match to second reference image with first image background */}
      <section className="ref-order-hero">
        <img
          src={heroBannerImg}
          alt={lang === "ta" ? "இன்றைய புதிய உணவுகள் - உலாவுக மற்றும் ஆர்டர் செய்க" : "What's fresh today? - Browse & Order"}
          className="ref-order-hero-img"
          draggable={false}
        />

        {/* Gradient overlay for perfect contrast */}
        <div className="ref-order-hero-gradient-overlay" />

        {/* Back to Home Button on top-left */}
        <button
          type="button"
          className="ref-order-back-btn"
          onClick={() => onNavigate(isAdmin ? "admin-dashboard" : "home")}
          aria-label={lang === "ta" ? "முகப்பு திரும்பு" : "Back to Home"}
        >
          <ArrowLeftIcon size={14} color="#ffffff" />
          <span>{lang === "ta" ? "முகப்பு திரும்பு" : "Back to Home"}</span>
        </button>

        {/* Hero Banner Text Content matching Image 2 */}
        <div className="ref-order-hero-text-wrap">
          <div className="ref-order-hero-label">
            {lang === "ta" ? "உலாவுக & ஆர்டர் செய்க" : "BROWSE & ORDER"}
          </div>
          <h1 className="ref-order-hero-title">
            {lang === "ta" ? (
              <>இன்றைய <span className="ref-hero-gold">புதிய</span> உணவுகள்?</>
            ) : (
              <>What's <span className="ref-hero-gold">fresh</span> today?</>
            )}
          </h1>
          <p className="ref-order-hero-subtitle">
            {lang === "ta"
              ? "சுவையான உணவு, சிறந்த மனநிலை. இப்போதே ஆர்டர் செய்யுங்கள்!"
              : "Delicious food, better mood. Order your favourites now!"}
          </p>
        </div>

        {/* Chalkboard 'Good Food Good Mood' matching Image 2 */}
        <div className="ref-order-hero-chalkboard" aria-hidden="true">
          <span className="ref-chalk-line1">Good Food</span>
          <span className="ref-chalk-line2">Good Mood</span>
          <span className="ref-chalk-smile">:)</span>
        </div>
      </section>

      {/* 2. LOW STOCK ALERT */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="ref-order-lowstock-banner">
          <AlertTriangleIcon size={18} color="#d97706" />
          <div>
            <strong>{lang === "ta" ? "குறைந்த இருப்பு எச்சரிக்கை!" : "Low Stock Alert!"}</strong>{" "}
            {lang === "ta" ? "விரைவில் தீர்ந்துவிடும்! குறைந்த இருப்பு: " : "Hurry! Stock is running low for "}{" "}
            {lowStockItems
              .map((i) => `${lang === "ta" ? (i.name_ta || i.name) : i.name} (${i.stock} ${lang === "ta" ? "மட்டுமே" : "left"})`)
              .join(", ")}
          </div>
        </div>
      )}

      {/* 3. CATEGORY FILTER PILLS */}
      <nav className="ref-order-cats-row" aria-label="Menu Categories">
        {CATEGORY_TABS.map((cat) => {
          const isActive = category === cat.id;
          const { Icon } = cat;
          return (
            <button
              key={cat.id}
              type="button"
              className={`ref-order-cat-pill${isActive ? " active" : ""}`}
              onClick={() => setCategory(cat.id)}
            >
              <Icon size={15} color={isActive ? "#ffffff" : "currentColor"} />
              <span>{lang === "ta" ? cat.labelTa : cat.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 4. FOOD ITEMS GRID */}
      <main className="ref-order-grid">

        {isAdmin && AddProductCard && (
          <AddProductCard />
        )}

        {filtered.length === 0 && (
          <div className="ref-order-empty">
            <span>🍽️</span>
            <p>{lang === "ta" ? "இந்த வகையில் உணவுகள் இல்லை." : "No items in this category."}</p>
          </div>
        )}

        {filtered.map((item) => {
          const qty = cart[item.id] || 0;
          const stock = item.stock ?? 0;
          const isAvailable = item.available !== false && stock > 0;
          const isLowStock = isAvailable && stock <= 5;
          const isVeg = item.dietTag === "veg";
          const itemName = lang === "ta" ? (item.name_ta || item.name) : item.name;
          const imgSrc = getDishImage(item);
          const nutrition = item.nutrition || {};

          return (
            <article
              key={item.id}
              className={`ref-food-card${!isAvailable ? " ref-food-card-unavail" : ""}`}
            >
              {/* Left: Image + Diet Badge */}
              <div className="ref-food-img-wrap">
                <div className={`ref-diet-badge ${isVeg ? "is-veg" : "is-non-veg"}`}>
                  {isVeg ? <LeafIcon size={11} color="#ffffff" /> : <MeatIcon size={11} color="#ffffff" />}
                  <span>{isVeg ? "Veg" : "Non-Veg"}</span>
                </div>
                <img
                  src={imgSrc}
                  alt={itemName}
                  className="ref-food-img"
                  loading="lazy"
                  onError={(e) => {
                    if (item.id === "lime_mint") {
                      e.currentTarget.src = "/canteen-assets/dish_lime_mint.jpg";
                    } else if (item.id === "mango_juice") {
                      e.currentTarget.src = "/canteen-assets/dish_mango_juice.jpg";
                    } else if (item.id === "watermelon_juice") {
                      e.currentTarget.src = "/canteen-assets/dish_watermelon_juice.jpg";
                    } else if (item.category === "juice") {
                      e.currentTarget.src = "/canteen-assets/dish_orange_juice.jpg";
                    } else {
                      e.currentTarget.src = "/canteen-assets/dish_veg_thali.jpg";
                    }
                  }}
                />
              </div>

              {/* Right Body */}
              <div className="ref-food-body">
                <div className="ref-food-top">
                  <div className="ref-food-title-row">
                    <h2 className="ref-food-name">{itemName}</h2>
                    {item.nutrition && (
                      <button
                        type="button"
                        className="ref-nutri-modal-btn"
                        onClick={() => setNutritionItem(item)}
                        title={lang === "ta" ? "ஊட்டச்சத்து தகவல்" : "Nutrition facts"}
                        aria-label="View Nutrition Facts"
                      >
                        <InfoIcon size={16} />
                      </button>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div
                    className={`ref-food-stock ${
                      !isAvailable ? "out-of-stock" : isLowStock ? "low-stock" : "in-stock"
                    }`}
                  >
                    <span className="ref-stock-dot" />
                    <span>
                      {isAvailable
                        ? isLowStock
                          ? `${lang === "ta" ? "குறைந்த இருப்பு" : "Low Stock"} · ${stock} ${lang === "ta" ? "மட்டுமே" : "left"}`
                          : `${lang === "ta" ? "கிடைக்கிறது" : "Available"} · ${stock} ${lang === "ta" ? "மட்டுமே" : "left"}`
                        : lang === "ta" ? "விற்று தீர்ந்தது" : "Sold out"}
                    </span>
                  </div>

                  {/* Macro Nutrition Chips */}
                  <div className="ref-food-nutri-row">
                    <span className="ref-nutri-chip kcal">🔥 {item.kcal || 0} kcal</span>
                    <span className="ref-nutri-chip protein">💪 {nutrition.protein || 0}g P</span>
                    <span className="ref-nutri-chip carbs">🌾 {nutrition.carbs || 0}g C</span>
                    <span className="ref-nutri-chip fat">🥑 {nutrition.fat || 0}g F</span>
                  </div>
                </div>

                {/* Bottom Row: Price & Add / Stepper */}
                <div className="ref-food-bottom">
                  <div className="ref-food-price">₹{item.price}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isAvailable ? (
                      qty === 0 ? (
                        <button
                          type="button"
                          className="ref-add-btn"
                          onClick={() => addToCart(item.id, 1)}
                        >
                          ADD +
                        </button>
                      ) : (
                        <div className="ref-order-stepper">
                          <button
                            type="button"
                            className="ref-stepper-btn"
                            onClick={() => setQty(item.id, qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span className="ref-stepper-qty">{qty}</span>
                          <button
                            type="button"
                            className="ref-stepper-btn"
                            onClick={() => setQty(item.id, qty + 1)}
                            aria-label="Increase quantity"
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>
                      )
                    ) : null}

                    {isAdmin && removeProduct && (
                      <button
                        type="button"
                        className="ref-admin-del-btn"
                        onClick={() => removeProduct(item.id)}
                        title="Delete product"
                      >
                        <TrashIcon size={13} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {/* 5. FLOATING CART SUMMARY BAR */}
      {cartCount > 0 && (
        <div className="ref-order-cartbar">
          <div className="ref-cartbar-left">
            <span className="ref-cartbar-count-badge">
              {cartCount} {cartCount === 1 ? (lang === "ta" ? "பொருள்" : "item") : (lang === "ta" ? "பொருட்கள்" : "items")}
            </span>
            <span className="ref-cartbar-text">₹{cartTotal}</span>
          </div>
          <button
            type="button"
            className="ref-cartbar-cta"
            onClick={() => onNavigate("cart")}
            id="view-cart-btn"
          >
            <span>{lang === "ta" ? "கார்ட் பார்க்க" : "View Cart"}</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* 6. NUTRITION FACTS MODAL */}
      {nutritionItem && NutritionModal && (
        <NutritionModal
          item={nutritionItem}
          lang={lang}
          onClose={() => setNutritionItem(null)}
        />
      )}
    </div>
  );
}
