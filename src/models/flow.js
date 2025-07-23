"use strict";

export default (sequelize, DataTypes) => {
  const Flow = sequelize.define(
    "flow",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      aspectId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      flow: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      durationInMinutes: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      pointValue: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      dtCompleted: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    { timestamps: false, tableName: "flow" }
  );

  Flow.associate = function (models) {
    Flow.belongsTo(models.aspect, {
      foreignKey: {
        name: "aspectId",
        type: DataTypes.UUID,
      },
      onDelete: "NO ACTION",
    });
  };

  return Flow;
};
