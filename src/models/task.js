"use strict";

export default (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "task",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      foreignId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      task: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      dtStart: {
        allowNull: false,
        default: Date.now(),
        type: DataTypes.DATE,
      },
      dtDue: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      dtCompleted: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      durationInMinutes: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: false, tableName: "task" }
  );

  Task.associate = function (models) {
    Task.belongsTo(models.User);
    Task.hasOne(models.Rrule, { onDelete: "CASCADE" });
  };

  // Task.sync({ alter: true });
  return Task;
};
