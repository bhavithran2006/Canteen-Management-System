const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Order",
    {
      // e.g. "ORD-4821"
      id:     { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
      userId: { type: DataTypes.STRING(50), allowNull: false },
      // Stored as a JSON array: [{ id, name, name_ta, price, qty }]
      items:  { type: DataTypes.JSON, defaultValue: [] },
      total:  { type: DataTypes.FLOAT, allowNull: false },
      paymentMode: { type: DataTypes.STRING(60), defaultValue: "UPI / GPay" },
      token:  { type: DataTypes.STRING(10), defaultValue: "" },
      issuedTime:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      completedTime: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
      /**
       * Status:
       *   0 = Placed   1 = Preparing   2 = Ready   3 = Completed / Picked Up   -1 = Cancelled
       */
      status:  { type: DataTypes.INTEGER, defaultValue: 0 },
      counter: { type: DataTypes.INTEGER, defaultValue: 1 },
      ingredientsDeducted: { type: DataTypes.BOOLEAN, defaultValue: false },
      // Canteen selected by customer at checkout
      canteenId:   { type: DataTypes.STRING(40), allowNull: true, defaultValue: null },
      canteenName: { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
      canteenLoc:  { type: DataTypes.STRING(120), allowNull: true, defaultValue: null },
      // ── QR Code Verification Fields ──
      qrToken:     { type: DataTypes.STRING(128), unique: true, allowNull: true },
      qrUsed:      { type: DataTypes.BOOLEAN, defaultValue: false },
      pickedUpAt:  { type: DataTypes.DATE, allowNull: true, defaultValue: null },
      pickedUpByStaffId:   { type: DataTypes.STRING(50), allowNull: true, defaultValue: null },
      pickedUpByStaffName: { type: DataTypes.STRING(120), allowNull: true, defaultValue: null },
      paymentStatus:       { type: DataTypes.STRING(20), defaultValue: "PAID" },
      transactionRef:      { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
    },
    { tableName: "orders" }
  );
