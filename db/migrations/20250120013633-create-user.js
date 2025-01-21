"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_db", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        isUnique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      verificationPin: {
        type: Sequelize.STRING,
        allowNull: true, // Pin will be null after verification
      },
      pinExpires: {
        type: Sequelize.DATE,
        allowNull: true, // Expiration date for the PIN
      },
      passwordResetPin: {
        type: Sequelize.STRING,
        allowNull: true, // Pin will be null after verification
      },
      passwordResetPinpinExpires: {
        type: Sequelize.DATE,
        allowNull: true, // Expiration date for the PIN
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_db");
  },
};
