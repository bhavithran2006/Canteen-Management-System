/**
 * seed.js — Populates MySQL with the same starter data hardcoded in App.jsx.
 * Usage: npm run seed
 * Idempotent — uses upsert so running it multiple times is safe.
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, MenuItem, Canteen, Feedback, Notification, Stock, StockTransaction, FoodIngredient } = require("./models");

/* ------------------------------------------------------------------ */
/* Seed data (mirrors App.jsx exactly)                                 */
/* ------------------------------------------------------------------ */
const USERS = [
  { id: "STAFF-01", name: "Canteen Manager",  email: "admin@canteen.edu", password: "admin", role: "admin",    dept: "Management",         year: 0, walletBalance: 0   },
  { id: "STAFF-02", name: "Chef Murugan",     email: "chef@canteen.edu",  password: "admin", role: "admin",    dept: "Kitchen Operations", year: 0, walletBalance: 0   },
  { id: "21CSE045", name: "Ananya Sharma",    email: "ananya@college.edu", password: "123",  role: "customer", dept: "CSE", year: 3, walletBalance: 340 },
  { id: "22ECE018", name: "Karthik Raja",     email: "karthik@college.edu",password: "123",  role: "customer", dept: "ECE", year: 2, walletBalance: 340 },
  { id: "23IT009",  name: "Priya Sundar",     email: "priya@college.edu",  password: "123",  role: "customer", dept: "IT",  year: 1, walletBalance: 340 },
];

const MENU_ITEMS = [
  {
    id: "veg_thali", name: "Veg thali", name_ta: "காய்கறி உணவு",
    price: 90, kcal: 320, category: "meals", icon: "thali", stock: 18,
    nutrition: { protein: 12, carbs: 48, fat: 9, fiber: 6, sugar: 5, sodium: 420 },
    allergens: ["Gluten", "Dairy"], dietTag: "veg",
    desc: "A wholesome balanced thali with dal, sabzi, rice, roti and pickle.",
  },
  {
    id: "chicken_biryani", name: "Chicken biryani", name_ta: "கோழி பிரியாணி",
    price: 130, kcal: 480, category: "meals", icon: "biryani", stock: 12,
    nutrition: { protein: 28, carbs: 52, fat: 18, fiber: 3, sugar: 4, sodium: 680 },
    allergens: ["Gluten"], dietTag: "non-veg",
    desc: "Aromatic basmati rice slow-cooked with tender chicken and whole spices.",
  },
  {
    id: "orange_juice", name: "Fresh Orange Juice", name_ta: "ஆரஞ்சு ஜூஸ்",
    price: 40, kcal: 110, category: "juice", icon: "juice", stock: 25,
    nutrition: { protein: 2, carbs: 26, fat: 0, fiber: 1, sugar: 22, sodium: 5 },
    allergens: [], dietTag: "veg",
    desc: "Freshly squeezed sweet orange juice packed with natural Vitamin C and citrus pulp.",
  },
  {
    id: "mango_juice", name: "Mango Juice", name_ta: "மாம்பழ ஜூஸ்",
    price: 50, kcal: 150, category: "juice", icon: "juice", stock: 20,
    nutrition: { protein: 1, carbs: 36, fat: 1, fiber: 2, sugar: 32, sodium: 10 },
    allergens: [], dietTag: "veg",
    desc: "Thick and luscious Alphonso mango blend, naturally sweet and perfectly chilled.",
  },
  {
    id: "watermelon_juice", name: "Watermelon Juice", name_ta: "தர்பூசணி ஜூஸ்",
    price: 35, kcal: 80, category: "juice", icon: "juice", stock: 30,
    nutrition: { protein: 1, carbs: 19, fat: 0, fiber: 1, sugar: 16, sodium: 5 },
    allergens: [], dietTag: "veg",
    desc: "Crisp and hydrating crushed watermelon juice with a subtle touch of black salt.",
  },
  {
    id: "lime_mint", name: "Lime Mint Cooler", name_ta: "எலுமிச்சை புதினா ஜூஸ்",
    price: 30, kcal: 45, category: "juice", icon: "juice", stock: 25,
    nutrition: { protein: 0, carbs: 12, fat: 0, fiber: 0, sugar: 10, sodium: 40 },
    allergens: [], dietTag: "veg",
    desc: "Tangy fresh lime cooler with muddled garden mint and crushed ice.",
  },
  {
    id: "paneer_wrap", name: "Paneer wrap", name_ta: "பன்னீர் ரோல்",
    price: 60, kcal: 260, category: "snacks", icon: "wrap", stock: 22,
    nutrition: { protein: 11, carbs: 30, fat: 10, fiber: 2, sugar: 3, sodium: 310 },
    allergens: ["Gluten", "Dairy"], dietTag: "veg",
    desc: "Grilled paneer with mint chutney and crunchy veggies in a soft wheat wrap.",
  },
  {
    id: "masala_chai", name: "Masala chai", name_ta: "மசாலா டீ",
    price: 15, kcal: 40, category: "beverages", icon: "cup", stock: 30,
    nutrition: { protein: 1, carbs: 7, fat: 1, fiber: 0, sugar: 6, sodium: 15 },
    allergens: ["Dairy"], dietTag: "veg",
    desc: "Freshly brewed spiced tea with ginger, cardamom and cinnamon.",
  },
  {
    id: "filter_coffee", name: "Filter coffee", name_ta: "பில்டர் காபி",
    price: 20, kcal: 35, category: "beverages", icon: "cup", stock: 18,
    nutrition: { protein: 1, carbs: 5, fat: 1, fiber: 0, sugar: 4, sodium: 10 },
    allergens: ["Dairy"], dietTag: "veg",
    desc: "Traditional South Indian drip coffee with creamy milk and decoction.",
  },
  {
    id: "brownie", name: "Brownie slice", name_ta: "பிரவுனி கேக்",
    price: 60, kcal: 310, category: "desserts", icon: "cup", stock: 0,
    nutrition: { protein: 4, carbs: 42, fat: 14, fiber: 2, sugar: 28, sodium: 190 },
    allergens: ["Gluten", "Dairy", "Eggs"], dietTag: "veg",
    desc: "Rich fudgy dark chocolate brownie baked fresh every morning.",
  },
];

const CANTEENS = [
  { id: "main",    name: "CSE Canteen",  name_ta: "சி.எஸ்.இ உணவகம்",    loc: "Block A · Ground floor", loc_ta: "பிளாக் ஏ · தரைத்தளம்",  level: "low",  status: "active" },
  { id: "hostel",  name: "S&H Canteen",  name_ta: "எஸ் & ஹெச் உணவகம்",  loc: "Block D",                loc_ta: "பிளாக் டி",             level: "high", status: "active" },
  { id: "library", name: "Mech Canteen", name_ta: "மெக் உணவகம்",         loc: "Block C · 1st floor",   loc_ta: "பிளாக் சி · 1ஆம் தளம்", level: "med",  status: "active" },
];

const FEEDBACKS = [
  { id: "fb-1", author: "Kavya R.",     roll: "22CSE012", rating: 5, category: "food_quality",  item: "Chicken biryani", tags: ["🔥 Hot & Fresh","🥗 Great Portion"],    comment: "The chicken biryani today was incredible!", date: "10 mins ago", helpful: 14, managerReply: "Thank you Kavya! Glad you loved today's batch." },
  { id: "fb-2", author: "Siddharth M.", roll: "21ECE088", rating: 4, category: "service_speed", item: "Masala chai",     tags: ["⚡ Fast Service","💰 Value for Money"], comment: "Token counter #2 was moving super fast.",   date: "1 hour ago",  helpful: 9,  managerReply: null },
  { id: "fb-3", author: "Priya S.",     roll: "23IT041",  rating: 5, category: "hygiene",       item: "Veg thali",       tags: ["🧹 Clean Area","🔥 Hot & Fresh"],       comment: "Super clean dining tables and friendly staff.", date: "3 hours ago", helpful: 21, managerReply: "Appreciate your kind words Priya!" },
  { id: "fb-4", author: "Vikram N.",    roll: "21MECH005",rating: 4, category: "app_experience",item: null,              tags: ["⚡ Fast Service"],                       comment: "Live crowd tracking helped me avoid the queue.", date: "Yesterday", helpful: 7,  managerReply: null },
];

const NOTIFICATIONS = [
  { id: "notif-1", userId: null, text: "🍽️ Your order is ready — Token A-14 at Counter 2", read: false },
  { id: "notif-2", userId: null, text: "⚠️ CSE Canteen is now Busy. Consider Mech Canteen.", read: false },
];

const WAIT = { low: 3, med: 7, high: 14 };

/* ------------------------------------------------------------------ */
/* Seed runner                                                          */
/* ------------------------------------------------------------------ */
async function seed() {
  try {
    await sequelize.authenticate();
    console.log("[seed] MySQL connected ✅");

    // Create / update all tables
    if (sequelize.getDialect() === "sqlite") {
      await sequelize.sync();
    } else {
      await sequelize.sync({ alter: true });
    }
    console.log("[seed] Tables synced ✅");

    // ── Users ──────────────────────────────────────────────────────
    for (const u of USERS) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.upsert({ ...u, password: hashed });
      console.log(`[seed] User: ${u.id} (${u.role})`);
    }

    // ── Menu Items ─────────────────────────────────────────────────
    for (const item of MENU_ITEMS) {
      await MenuItem.upsert({ ...item, available: item.stock > 0 });
      console.log(`[seed] MenuItem: ${item.id}`);
    }

    // ── Canteens ───────────────────────────────────────────────────
    for (const c of CANTEENS) {
      await Canteen.upsert({ ...c, wait: WAIT[c.level], lastUpdated: new Date() });
      console.log(`[seed] Canteen: ${c.id}`);
    }

    // ── Feedback ───────────────────────────────────────────────────
    for (const fb of FEEDBACKS) {
      await Feedback.upsert(fb);
      console.log(`[seed] Feedback: ${fb.id}`);
    }

    // ── Notifications ──────────────────────────────────────────────
    for (const n of NOTIFICATIONS) {
      await Notification.upsert(n);
      console.log(`[seed] Notification: ${n.id}`);
    }

    // ── Raw Material Stocks ─────────────────────────────────────────
    const STOCKS = [
      { id: 1, stockId: "STK-1001", stockName: "Rice", category: "Grains", quantity: 50, unit: "kg", minimumStockLevel: 10, purchasePrice: 2500, supplierName: "ABC Suppliers", purchaseDate: "2026-09-10", expiryDate: "2027-03-21" },
      { id: 2, stockId: "STK-1002", stockName: "Tomato", category: "Vegetables", quantity: 2, unit: "kg", minimumStockLevel: 5, purchasePrice: 80, supplierName: "Fresh Farms", purchaseDate: "2026-09-18", expiryDate: "2026-09-23" },
      { id: 3, stockId: "STK-1003", stockName: "Onion", category: "Vegetables", quantity: 0, unit: "kg", minimumStockLevel: 5, purchasePrice: 0, supplierName: "Fresh Farms", purchaseDate: "2026-09-10", expiryDate: "2026-10-10" },
      { id: 4, stockId: "STK-1004", stockName: "Potato", category: "Vegetables", quantity: 25, unit: "kg", minimumStockLevel: 8, purchasePrice: 750, supplierName: "Agro Foods", purchaseDate: "2026-09-15", expiryDate: "2026-10-15" },
      { id: 5, stockId: "STK-1005", stockName: "Carrot", category: "Vegetables", quantity: 8, unit: "kg", minimumStockLevel: 3, purchasePrice: 400, supplierName: "Agro Foods", purchaseDate: "2026-09-15", expiryDate: "2026-09-28" },
      { id: 6, stockId: "STK-1006", stockName: "Milk", category: "Dairy", quantity: 3, unit: "litre", minimumStockLevel: 5, purchasePrice: 180, supplierName: "Dairy Fresh", purchaseDate: "2026-09-20", expiryDate: "2026-09-23" },
      { id: 7, stockId: "STK-1007", stockName: "Oil", category: "Oils", quantity: 30, unit: "litre", minimumStockLevel: 5, purchasePrice: 3600, supplierName: "Gold Drop Refineries", purchaseDate: "2026-09-01", expiryDate: "2027-01-10" },
      { id: 8, stockId: "STK-1008", stockName: "Flour", category: "Grains", quantity: 40, unit: "kg", minimumStockLevel: 10, purchasePrice: 1600, supplierName: "Royal Mills", purchaseDate: "2026-09-05", expiryDate: "2026-12-15" },
      { id: 9, stockId: "STK-1009", stockName: "Eggs", category: "Dairy", quantity: 100, unit: "piece", minimumStockLevel: 20, purchasePrice: 600, supplierName: "Poultry King", purchaseDate: "2026-09-16", expiryDate: "2026-10-01" },
      { id: 10, stockId: "STK-1010", stockName: "Chicken", category: "Meat", quantity: 20, unit: "kg", minimumStockLevel: 5, purchasePrice: 4400, supplierName: "Fresh Meat Co", purchaseDate: "2026-09-20", expiryDate: "2026-09-22" },
      { id: 11, stockId: "STK-1011", stockName: "Spices", category: "Spices", quantity: 10, unit: "kg", minimumStockLevel: 2, purchasePrice: 2000, supplierName: "Spice Valley", purchaseDate: "2026-08-15", expiryDate: "2027-06-30" },
      { id: 12, stockId: "STK-1012", stockName: "Sugar", category: "Sweeteners", quantity: 25, unit: "kg", minimumStockLevel: 5, purchasePrice: 1125, supplierName: "Sweet Sugars Ltd", purchaseDate: "2026-08-20", expiryDate: "2027-05-15" },
    ];

    for (const s of STOCKS) {
      await Stock.upsert(s);
      console.log(`[seed] Stock: ${s.stockId} - ${s.stockName}`);
    }

    // ── Initial Stock Purchase Transactions ─────────────────────────
    const initialTxs = [
      { stockId: 1, stockName: "Rice", type: "PURCHASE", quantity: 50, unit: "kg", previousStock: 0, newStock: 50, reason: "Supplier purchase from ABC Suppliers", supplierName: "ABC Suppliers", purchasePrice: 2500, performedBy: "Canteen Manager" },
      { stockId: 6, stockName: "Milk", type: "PURCHASE", quantity: 10, unit: "litre", previousStock: 0, newStock: 10, reason: "Morning milk batch delivery", supplierName: "Dairy Fresh", purchasePrice: 600, performedBy: "Chef Murugan" },
      { stockId: 6, stockName: "Milk", type: "USED", quantity: -5, unit: "litre", previousStock: 10, newStock: 5, reason: "Morning tea and coffee batches", supplierName: "Dairy Fresh", purchasePrice: 0, performedBy: "Chef Murugan" },
      { stockId: 6, stockName: "Milk", type: "WASTAGE", quantity: -2, unit: "litre", previousStock: 5, newStock: 3, reason: "Spilled container during prep", supplierName: "Dairy Fresh", purchasePrice: 0, performedBy: "Chef Murugan" },
      { stockId: 7, stockName: "Oil", type: "PURCHASE", quantity: 30, unit: "litre", previousStock: 0, newStock: 30, reason: "Monthly cooking oil bulk procurement", supplierName: "Gold Drop Refineries", purchasePrice: 3600, performedBy: "Canteen Manager" },
    ];

    for (const tx of initialTxs) {
      const existing = await StockTransaction.findOne({ where: { stockId: tx.stockId, reason: tx.reason } });
      if (!existing) {
        await StockTransaction.create({ ...tx, date: new Date() });
      }
    }

    // ── Food Recipe Ingredient Mappings ─────────────────────────────
    const FOOD_RECIPES = [
      // veg_thali: Rice 0.2kg, Potato 0.1kg, Oil 0.02L, Spices 0.01kg
      { menuItemId: "veg_thali", stockId: 1, quantity: 0.2, unit: "kg", notes: "Basmati/Sona Masoori rice" },
      { menuItemId: "veg_thali", stockId: 4, quantity: 0.1, unit: "kg", notes: "Potato sabzi ingredient" },
      { menuItemId: "veg_thali", stockId: 7, quantity: 0.02, unit: "litre", notes: "Cooking oil for tadka" },
      { menuItemId: "veg_thali", stockId: 11, quantity: 0.01, unit: "kg", notes: "Garam masala & turmeric" },

      // chicken_biryani: Rice 0.25kg, Chicken 0.15kg, Oil 0.03L, Spices 0.02kg
      { menuItemId: "chicken_biryani", stockId: 1, quantity: 0.25, unit: "kg", notes: "Long grain biryani rice" },
      { menuItemId: "chicken_biryani", stockId: 10, quantity: 0.15, unit: "kg", notes: "Fresh tender chicken cuts" },
      { menuItemId: "chicken_biryani", stockId: 7, quantity: 0.03, unit: "litre", notes: "Refined oil" },
      { menuItemId: "chicken_biryani", stockId: 11, quantity: 0.02, unit: "kg", notes: "Biryani whole & ground spices" },

      // masala_chai: Milk 0.1L, Sugar 0.01kg, Spices 0.005kg
      { menuItemId: "masala_chai", stockId: 6, quantity: 0.1, unit: "litre", notes: "Fresh boiled milk" },
      { menuItemId: "masala_chai", stockId: 12, quantity: 0.01, unit: "kg", notes: "Granulated sugar" },
      { menuItemId: "masala_chai", stockId: 11, quantity: 0.005, unit: "kg", notes: "Cardamom and ginger tea spice" },

      // filter_coffee: Milk 0.12L, Sugar 0.01kg
      { menuItemId: "filter_coffee", stockId: 6, quantity: 0.12, unit: "litre", notes: "Creamy boiled milk" },
      { menuItemId: "filter_coffee", stockId: 12, quantity: 0.01, unit: "kg", notes: "Sugar" },

      // paneer_wrap: Flour 0.08kg, Carrot 0.05kg, Oil 0.01L
      { menuItemId: "paneer_wrap", stockId: 8, quantity: 0.08, unit: "kg", notes: "Whole wheat wrap flour" },
      { menuItemId: "paneer_wrap", stockId: 5, quantity: 0.05, unit: "kg", notes: "Grated carrot crunchy filling" },
      { menuItemId: "paneer_wrap", stockId: 7, quantity: 0.01, unit: "litre", notes: "Tawa oil for grilling wrap" },
    ];

    for (const r of FOOD_RECIPES) {
      const existing = await FoodIngredient.findOne({ where: { menuItemId: r.menuItemId, stockId: r.stockId } });
      if (!existing) {
        await FoodIngredient.create(r);
        console.log(`[seed] Recipe Mapping: ${r.menuItemId} -> Stock #${r.stockId} (${r.quantity} ${r.unit})`);
      }
    }

    console.log("\n✅ Database Seed complete! All tables, stocks, transactions & recipes populated.\n");
  } catch (err) {
    console.error("[seed] Error:", err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
