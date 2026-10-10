const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Feedback",
    {
      id:     { type: DataTypes.STRING(40), primaryKey: true, allowNull: false },
      author: { type: DataTypes.STRING(100), allowNull: false },
      roll:   { type: DataTypes.STRING(50), allowNull: false },
      rating: { type: DataTypes.INTEGER, defaultValue: 5 },
      category: {
        type: DataTypes.ENUM("food_quality", "service_speed", "hygiene", "app_experience"),
        defaultValue: "food_quality",
      },
      item:         { type: DataTypes.STRING(120), allowNull: true, defaultValue: null },
      tags:         { type: DataTypes.JSON, defaultValue: [] },
      comment:      { type: DataTypes.TEXT, defaultValue: "" },
      date:         { type: DataTypes.STRING(40), defaultValue: "Just now" },
      helpful:      { type: DataTypes.INTEGER, defaultValue: 0 },
      managerReply: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    },
    { tableName: "feedbacks" }
  );
