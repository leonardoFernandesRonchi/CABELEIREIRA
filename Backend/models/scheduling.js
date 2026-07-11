"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Scheduling extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      this.belongsToMany(models.Service, {
        through: models.SchedulingService,
        foreignKey: "schedulingId",
        otherKey: "serviceId",
        as: "services",
      });
    }
  }

  Scheduling.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      dateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
    },
    {
      sequelize,
      modelName: "Scheduling",
      underscored: true,
    },
  );

  return Scheduling;
};
