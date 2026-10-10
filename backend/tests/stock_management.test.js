const assert = require("assert");
const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");

process.env.DB_DIALECT = "sqlite";
process.env.DB_STORAGE = ":memory:";
process.env.JWT_SECRET = "test_jwt_secret_12345";

const {
  sequelize,
  User,
  MenuItem,
  Order,
  Stock,
  StockTransaction,
  FoodIngredient,
  Notification,
} = require("../models");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const stockRoutes = require("../routes/stock");
const { advanceOrder } = require("../controllers/orderController");

const app = express();
app.use(express.json());

// Routes under test
app.use("/api/admin/stock", stockRoutes);
app.use("/api/admin/menu-ingredients", stockRoutes.recipeRouter);
app.patch("/api/orders/:id/advance", auth, adminOnly, advanceOrder);

let server;
let baseUrl;
let adminToken;
let studentToken;

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {
            json = data;
          }
          resolve({ status: res.statusCode, body: json });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("🚀 Running Admin Stock Management System Tests");
  console.log("==================================================");

  await sequelize.sync({ force: true });

  // Generate test JWT tokens
  adminToken = jwt.sign(
    { id: "STAFF-01", name: "Canteen Manager", email: "admin@canteen.edu", role: "admin" },
    process.env.JWT_SECRET
  );

  studentToken = jwt.sign(
    { id: "21CSE045", name: "Ananya Sharma", email: "ananya@college.edu", role: "customer" },
    process.env.JWT_SECRET
  );

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  try {
    // ── Test 1: Authorization & Security ───────────────────────────
    console.log("▶ Test 1: Authorization check");
    const noAuth = await request("GET", "/api/admin/stock");
    assert.strictEqual(noAuth.status, 401, "Should reject unauthenticated access with 401");

    const studentRes = await request("GET", "/api/admin/stock", null, studentToken);
    assert.strictEqual(studentRes.status, 403, "Should reject customer access with 403");

    const adminRes = await request("GET", "/api/admin/stock", null, adminToken);
    assert.strictEqual(adminRes.status, 200, "Should allow admin access with 200");
    console.log("  ✅ Security: Unauthenticated=401, Customer=403, Admin=200");

    // ── Test 2: Input Validation ───────────────────────────────────
    console.log("▶ Test 2: Input validation for stock creation");
    const emptyName = await request("POST", "/api/admin/stock", { stockName: "" }, adminToken);
    assert.strictEqual(emptyName.status, 400, "Should reject empty stockName with 400");

    const negQty = await request(
      "POST",
      "/api/admin/stock",
      { stockName: "Salt", quantity: -10 },
      adminToken
    );
    assert.strictEqual(negQty.status, 400, "Should reject negative quantity with 400");

    const negPrice = await request(
      "POST",
      "/api/admin/stock",
      { stockName: "Salt", purchasePrice: -50 },
      adminToken
    );
    assert.strictEqual(negPrice.status, 400, "Should reject negative purchasePrice with 400");
    console.log("  ✅ Validation: Empty name, negative quantity & negative price rejected");

    // ── Test 3: Create Stock & Status Calculations ─────────────────
    console.log("▶ Test 3: Create Stock & Calculate Statuses");
    // Normal stock
    const riceRes = await request(
      "POST",
      "/api/admin/stock",
      {
        stockName: "Rice",
        category: "Grains",
        quantity: 20,
        unit: "kg",
        minimumStockLevel: 10,
        purchasePrice: 1000,
        supplierName: "ABC Suppliers",
        expiryDate: "2027-01-01",
      },
      adminToken
    );
    assert.strictEqual(riceRes.status, 201);
    assert.strictEqual(riceRes.body.status, "IN STOCK");
    const riceId = riceRes.body.id;

    // Low stock
    const milkRes = await request(
      "POST",
      "/api/admin/stock",
      {
        stockName: "Milk",
        category: "Dairy",
        quantity: 3,
        unit: "litre",
        minimumStockLevel: 5,
        purchasePrice: 180,
        supplierName: "Dairy Fresh",
        expiryDate: "2027-01-01",
      },
      adminToken
    );
    assert.strictEqual(milkRes.status, 201);
    assert.strictEqual(milkRes.body.status, "LOW STOCK");
    const milkId = milkRes.body.id;

    // Out of stock
    const onionRes = await request(
      "POST",
      "/api/admin/stock",
      {
        stockName: "Onion",
        category: "Vegetables",
        quantity: 0,
        unit: "kg",
        minimumStockLevel: 5,
        purchasePrice: 0,
        supplierName: "Fresh Farms",
        expiryDate: "2027-01-01",
      },
      adminToken
    );
    assert.strictEqual(onionRes.status, 201);
    assert.strictEqual(onionRes.body.status, "OUT OF STOCK");

    // Expired stock
    const expiredRes = await request(
      "POST",
      "/api/admin/stock",
      {
        stockName: "Old Tomato",
        category: "Vegetables",
        quantity: 10,
        unit: "kg",
        minimumStockLevel: 2,
        purchasePrice: 200,
        supplierName: "Fresh Farms",
        expiryDate: "2020-01-01",
      },
      adminToken
    );
    assert.strictEqual(expiredRes.status, 201);
    assert.strictEqual(expiredRes.body.status, "EXPIRED");
    assert.strictEqual(expiredRes.body.isExpired, true);

    console.log("  ✅ Status calculation: IN STOCK, LOW STOCK, OUT OF STOCK, EXPIRED verified");

    // ── Test 4: Purchase / Add Stock ───────────────────────────────
    console.log("▶ Test 4: Purchase additional stock (+50 kg Rice for ₹2500)");
    const purchaseRes = await request(
      "POST",
      `/api/admin/stock/${riceId}/add`,
      {
        quantity: 50,
        purchasePrice: 2500,
        supplierName: "ABC Suppliers",
        reason: "Bulk purchase batch 2026",
      },
      adminToken
    );
    assert.strictEqual(purchaseRes.status, 200);
    assert.strictEqual(purchaseRes.body.stock.quantity, 70, "Rice quantity should increase from 20 to 70");
    assert.strictEqual(purchaseRes.body.transaction.type, "PURCHASE");
    assert.strictEqual(purchaseRes.body.transaction.previousStock, 20);
    assert.strictEqual(purchaseRes.body.transaction.newStock, 70);
    console.log("  ✅ Purchase: Stock increased from 20 kg to 70 kg, transaction type PURCHASE logged");

    // ── Test 5: Reduce Stock with Audited Reason ────────────────────
    console.log("▶ Test 5: Reduce stock (5 kg Rice used for Food preparation)");
    const reduceRes = await request(
      "POST",
      `/api/admin/stock/${riceId}/reduce`,
      {
        quantity: 5,
        reason: "Food preparation",
        notes: "Lunch meal prep",
      },
      adminToken
    );
    assert.strictEqual(reduceRes.status, 200);
    assert.strictEqual(reduceRes.body.stock.quantity, 65, "Rice quantity should decrease from 70 to 65");
    assert.strictEqual(reduceRes.body.transaction.previousStock, 70);
    assert.strictEqual(reduceRes.body.transaction.newStock, 65);
    console.log("  ✅ Reduce: Stock decreased from 70 kg to 65 kg, transaction logged");

    // ── Test 6: Insufficient Stock Validation ──────────────────────
    console.log("▶ Test 6: Reject reduction exceeding available stock");
    const overReduceRes = await request(
      "POST",
      `/api/admin/stock/${riceId}/reduce`,
      {
        quantity: 100,
        reason: "Food preparation",
      },
      adminToken
    );
    assert.strictEqual(overReduceRes.status, 400);
    assert.ok(
      overReduceRes.body.error.includes("Insufficient stock"),
      "Error should clearly state insufficient stock"
    );
    console.log("  ✅ Validation: Over-reduction rejected with message: " + overReduceRes.body.error);

    // ── Test 7: Stock Transaction History & Filtering ──────────────
    console.log("▶ Test 7: Fetch and filter transaction history");
    const historyRes = await request("GET", `/api/admin/stock/${riceId}/history`, null, adminToken);
    assert.strictEqual(historyRes.status, 200);
    assert.ok(historyRes.body.length >= 2, "Should contain purchase and reduction transactions");

    const filteredHist = await request("GET", "/api/admin/stock/history?type=PURCHASE", null, adminToken);
    assert.strictEqual(filteredHist.status, 200);
    assert.ok(filteredHist.body.every((tx) => tx.type === "PURCHASE"));
    console.log("  ✅ History: Item history and type filtering verified");

    // ── Test 8: Recipe Ingredient Mapping ──────────────────────────
    console.log("▶ Test 8: Recipe ingredient mapping to menu items");
    await MenuItem.create({
      id: "veg_fried_rice",
      name: "Veg Fried Rice",
      price: 100,
      category: "meals",
      stock: 50,
      available: true,
    });

    const mapRes = await request(
      "POST",
      "/api/admin/menu-ingredients",
      {
        menuItemId: "veg_fried_rice",
        stockId: riceId,
        quantity: 0.2, // 0.2 kg per serving
        unit: "kg",
        notes: "Cooked basmati rice",
      },
      adminToken
    );
    assert.strictEqual(mapRes.status, 200);
    assert.strictEqual(mapRes.body.quantity, 0.2);

    const getMapRes = await request(
      "GET",
      "/api/admin/menu-ingredients/veg_fried_rice",
      null,
      adminToken
    );
    assert.strictEqual(getMapRes.status, 200);
    assert.strictEqual(getMapRes.body.length, 1);
    console.log("  ✅ Recipe: Mapped 0.2 kg Rice to Veg Fried Rice successfully");

    // ── Test 9: Automatic Order Deduction ──────────────────────────
    console.log("▶ Test 9: Automatic stock deduction when order is confirmed / preparing");
    // Initial Rice stock is 65 kg.
    // Order 5 Veg Fried Rice -> 5 * 0.2 kg = 1.0 kg Rice deduction.
    const testOrder = await Order.create({
      id: "ORD-TEST-99",
      userId: "21CSE045",
      items: [{ id: "veg_fried_rice", name: "Veg Fried Rice", price: 100, qty: 5 }],
      total: 500,
      status: 0, // Placed
      ingredientsDeducted: false,
    });

    // Advance order to Preparing (status 1)
    const advRes = await request("PATCH", `/api/orders/${testOrder.id}/advance`, null, adminToken);
    assert.strictEqual(advRes.status, 200);
    assert.strictEqual(advRes.body.status, 1);
    assert.strictEqual(advRes.body.ingredientsDeducted, true);

    const updatedRice = await Stock.findByPk(riceId);
    assert.strictEqual(
      updatedRice.quantity,
      64,
      "Rice stock should decrease from 65 kg to 64 kg (1.0 kg deduction)"
    );

    // Verify FOOD_PREPARATION transaction logged
    const prepTx = await StockTransaction.findOne({
      where: { orderId: "ORD-TEST-99", type: "FOOD_PREPARATION" },
    });
    assert.ok(prepTx, "Should record FOOD_PREPARATION transaction with order ID");
    assert.strictEqual(prepTx.quantity, -1.0);

    // Verify advancing order again to Ready (status 2) does NOT deduct twice
    await request("PATCH", `/api/orders/${testOrder.id}/advance`, null, adminToken);
    const riceAfterSecondAdvance = await Stock.findByPk(riceId);
    assert.strictEqual(
      riceAfterSecondAdvance.quantity,
      64,
      "Stock should not be deducted twice"
    );

    console.log("  ✅ Order deduction: 1.0 kg Rice deducted on prep, idempotency verified");

    console.log("==================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! (100% PASS)");
    console.log("==================================================");
  } finally {
    if (server) server.close();
  }
}

runTests().catch((err) => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
