const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Stock",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stockId: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      stockName: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: "Other",
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      unit: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "kg",
      },
      minimumStockLevel: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 5,
        validate: {
          min: 0,
        },
      },
      purchasePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      supplierName: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: "",
      },
      purchaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: "stocks",
      timestamps: true,
    }
  );
