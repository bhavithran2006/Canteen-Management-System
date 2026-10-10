const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "User",
    {
      // Roll number (21CSE045) or staff ID (STAFF-01) — primary identifier
      id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        set(val) { this.setDataValue("email", val.toLowerCase().trim()); },
      },
      password: { type: DataTypes.STRING(255), allowNull: true },
      googleId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "customer"),
        defaultValue: "customer",
      },
      dept: { type: DataTypes.STRING(80), defaultValue: "CSE" },
      year: { type: DataTypes.INTEGER, defaultValue: 1 },
      walletBalance: { type: DataTypes.FLOAT, defaultValue: 340 },
    },
    {
      tableName: "users",
      // Strip password from JSON output automatically
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );
