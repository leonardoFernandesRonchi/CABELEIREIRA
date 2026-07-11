"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Scheduling, {
        foreignKey: "userId",
        as: "schedulings",
      });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM("ADMIN", "CLIENT"),
        allowNull: false,
        defaultValue: "CLIENT",
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      underscored: true,

      scopes: {
        admins: {
          where: {
            role: "ADMIN",
          },
        },

        clients: {
          where: {
            role: "CLIENT",
          },
        },

        active: {
          where: {
            isActive: true,
          },
        },
      },
    },
  );

  return User;
};
