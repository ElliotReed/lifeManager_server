"use strict";

module.exports = (sequelize, DataTypes) => {
  const RRule = sequelize.define(
    "rrule",
    {
      taskId: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
      },
      rule: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    { timestamps: false, tableName: "rrule" }
  );

  RRule.associate = function (models) {
    RRule.belongsTo(models.task, { foreignKey: "taskId", onDelete: "CASCADE" });
  };

  // RRule.sync({ alter: true });
  return RRule;
};
