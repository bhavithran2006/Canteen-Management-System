const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Notification",
    {
      id: { type: DataTypes.STRING(60), primaryKey: true, allowNull: false },
      // null = broadcast to all users; otherwise the recipient's user id
      userId: { type: DataTypes.STRING(50), allowNull: true, defaultValue: null },
      text:   { type: DataTypes.TEXT, allowNull: false },
      read:   { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: "notifications" }
  );
