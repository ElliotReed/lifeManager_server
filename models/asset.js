"use strict";

module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define(
    "asset",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      typeId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { tableName: "asset" }
  );

  // Asset.sync({ alter: true });
  return Asset;
};
