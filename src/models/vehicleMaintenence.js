"use strict";

export default (sequelize, DataTypes) => {
  const VehicleMaintenence = sequelize.define(
    "vehicleMaintenence",
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date: {
        allowNull: false,
        defaultValue: Date.now(),
        type: DataTypes.DATE,
      },
      cost: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      // mileage: {
      //   allowNull: true,
      //   type: DataTypes.INTEGER,
      // },
    },
    { timestamps: false, tableName: "vehicleMaintenence" }
  );

  VehicleMaintenence.associate = function (models) { };

  return VehicleMaintenence;
};
