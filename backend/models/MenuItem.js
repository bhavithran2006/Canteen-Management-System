const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "MenuItem",
    {
      // Slug e.g. "veg_thali" — frontend identifier
      id: {
        type: DataTypes.STRING(80),
        primaryKey: true,
        allowNull: false,
      },
      name:    { type: DataTypes.STRING(120), allowNull: false },
      name_ta: { type: DataTypes.STRING(120), defaultValue: "" },
      price:   { type: DataTypes.FLOAT, allowNull: false },
      kcal:    { type: DataTypes.INTEGER, defaultValue: 0 },
      category: {
        type: DataTypes.ENUM("meals", "juice", "snacks", "beverages", "desserts"),
        allowNull: false,
      },
      icon:    { type: DataTypes.STRING(40), defaultValue: "cup" },
      stock:   { type: DataTypes.INTEGER, defaultValue: 0 },
      // Derived — always kept in sync by controllers (stock > 0)
      available: { type: DataTypes.BOOLEAN, defaultValue: false },
      // JSON columns (requires MySQL 5.7.8+)
      nutrition: { type: DataTypes.JSON, defaultValue: {} },
      allergens: { type: DataTypes.JSON, defaultValue: [] },
      dietTag:   { type: DataTypes.STRING(20), defaultValue: "veg" },
      desc:      { type: DataTypes.TEXT, defaultValue: "" },
    },
    { tableName: "menu_items" }
  );
