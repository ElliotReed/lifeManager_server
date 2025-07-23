"use strict";

export default (sequelize, DataTypes) => {
  const AssetType = sequelize.define(
    "assetType",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false, tableName: "assetType" }
  );

  // AssetType.sync({ alter: true });
  return AssetType;
};
