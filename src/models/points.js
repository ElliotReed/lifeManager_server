"use strict";

export default (sequelize, DataTypes) => {
  const Points = sequelize.define(
    "points",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      points: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: true, tableName: "points" }
  );

  Points.associate = function (models) {
    Points.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Points;
};
