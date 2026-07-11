"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchedulingService extends Model {
    static associate(models) {
      this.belongsTo(models.Scheduling, {
        foreignKey: "schedulingId",
        as: "scheduling",
      });

      this.belongsTo(models.Service, {
        foreignKey: "serviceId",
        as: "service",
      });
    }
  }

  SchedulingService.init(
    {
      schedulingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELLED",
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },
    },
    {
      sequelize,
      modelName: "SchedulingService",
      underscored: true,
    },
  );

  return SchedulingService;
};
