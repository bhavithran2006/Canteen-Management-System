/**
 * models/index.js
 * Initialises Sequelize, imports every model, and exports them all.
 * Call sequelize.sync() once from server.js / seed.js.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { Sequelize } = require("sequelize");

const dialect = process.env.DB_DIALECT || "mysql";
const sequelizeOptions = {
  dialect,
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: true,
  },
};

if (dialect === "sqlite") {
  sequelizeOptions.storage = process.env.DB_STORAGE || path.join(__dirname, "../canteen.sqlite");
} else {
  sequelizeOptions.host = process.env.DB_HOST || "localhost";
  sequelizeOptions.port = Number(process.env.DB_PORT) || 3306;
  sequelizeOptions.pool = { max: 10, min: 0, acquire: 30000, idle: 10000 };
}

const sequelize = new Sequelize(
  process.env.DB_NAME || "canteen_db",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  sequelizeOptions
);

// ── Import models (each file calls sequelize.define internally) ──────
const User             = require("./User")(sequelize);
const MenuItem         = require("./MenuItem")(sequelize);
const Canteen          = require("./Canteen")(sequelize);
const Order            = require("./Order")(sequelize);
const Feedback         = require("./Feedback")(sequelize);
const Notification     = require("./Notification")(sequelize);
const PasswordResetOtp = require("./PasswordResetOtp")(sequelize);
const Stock            = require("./Stock")(sequelize);
const StockTransaction = require("./StockTransaction")(sequelize);
const FoodIngredient   = require("./FoodIngredient")(sequelize);

// ── Associations ─────────────────────────────────────────────────────
Stock.hasMany(StockTransaction, { foreignKey: "stockId", as: "transactions", onDelete: "CASCADE" });
StockTransaction.belongsTo(Stock, { foreignKey: "stockId", as: "stock" });

MenuItem.hasMany(FoodIngredient, { foreignKey: "menuItemId", as: "ingredients", onDelete: "CASCADE" });
FoodIngredient.belongsTo(MenuItem, { foreignKey: "menuItemId", as: "menuItem" });

Stock.hasMany(FoodIngredient, { foreignKey: "stockId", as: "recipeUsages", onDelete: "CASCADE" });
FoodIngredient.belongsTo(Stock, { foreignKey: "stockId", as: "stockItem" });

module.exports = {
  sequelize,
  User,
  MenuItem,
  Canteen,
  Order,
  Feedback,
  Notification,
  PasswordResetOtp,
  Stock,
  StockTransaction,
  FoodIngredient,
};
