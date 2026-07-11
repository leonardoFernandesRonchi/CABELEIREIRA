"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("admin", 10);

    await queryInterface.bulkInsert("Users", [
      {
        email: "admin@admin.com",
        password: passwordHash,
        username: "Administrador",
        role: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {
      email: "admin@admin.com",
    });
  },
};
