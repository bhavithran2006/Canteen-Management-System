const { DataTypes } = require("sequelize");

const WAIT_BY_LEVEL = { low: 3, med: 7, high: 14 };

module.exports = (sequelize) => {
  const Canteen = sequelize.define(
    "Canteen",
    {
      id:       { type: DataTypes.STRING(40), primaryKey: true, allowNull: false },
      name:     { type: DataTypes.STRING(100), allowNull: false },
      name_ta:  { type: DataTypes.STRING(100), defaultValue: "" },
      loc:      { type: DataTypes.STRING(120), defaultValue: "" },
      loc_ta:   { type: DataTypes.STRING(120), defaultValue: "" },
      level: {
        type: DataTypes.ENUM("low", "med", "high"),
        defaultValue: "low",
      },
      // wait is always derived from level — never set by client
      wait: { type: DataTypes.INTEGER, defaultValue: 3 },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
        allowNull: false,
      },
      lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "canteens",
      hooks: {
        // Derive wait every time a record is saved
        beforeSave(canteen) {
          if (canteen.changed("level")) {
            canteen.wait = WAIT_BY_LEVEL[canteen.level] ?? 3;
            canteen.lastUpdated = new Date();
          }
        },
      },
    }
  );

  return Canteen;
};
