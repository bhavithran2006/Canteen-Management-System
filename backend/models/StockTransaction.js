const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "StockTransaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stockName: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          "PURCHASE",
          "USED",
          "WASTAGE",
          "DAMAGED",
          "EXPIRED",
          "FOOD_PREPARATION",
          "ADJUSTMENT",
          "RETURN"
        ),
        allowNull: false,
        defaultValue: "ADJUSTMENT",
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "kg",
      },
      previousStock: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      newStock: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      supplierName: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: "",
      },
      purchasePrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      performedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "Admin",
      },
      orderId: {
        type: DataTypes.STRING(40),
        allowNull: true,
        defaultValue: null,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "stock_transactions",
      timestamps: true,
    }
  );
