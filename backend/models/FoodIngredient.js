const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "FoodIngredient",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      menuItemId: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      stockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0.0001,
        },
      },
      unit: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "kg",
      },
      notes: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      tableName: "food_ingredients",
      timestamps: true,
    }
  );
