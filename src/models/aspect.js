"use strict";

export default (sequelize, DataTypes) => {
  const Aspect = sequelize.define(
    "aspect",
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
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    { timestamps: false, tableName: "aspect" }
  );

  Aspect.associate = function (models) {
    Aspect.hasMany(models.flow, {
      foreignKey: {
        name: "aspectId",
        type: DataTypes.UUID,
      },
      onDelete: "NO ACTION",
    });

    Aspect.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Aspect;
};
