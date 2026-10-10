const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "PasswordResetOtp",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        set(val) {
          this.setDataValue("email", val ? val.toLowerCase().trim() : "");
        },
      },
      otpHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      resetTokenHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      maxAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "password_reset_otps",
      timestamps: true,
      indexes: [
        { fields: ["email"] },
        { fields: ["expiresAt"] },
      ],
    }
  );
