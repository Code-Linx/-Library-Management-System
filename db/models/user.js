"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define(
  "user_db",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address.",
        },
      },
    },
    verificationPin: {
      type: DataTypes.STRING,
      allowNull: true, // Pin will be null after verification
    },

    pinExpires: {
      type: DataTypes.DATE,
      allowNull: true, // Expiration date for the PIN
    },
    passwordResetPin: {
      type: DataTypes.STRING,
      allowNull: true, // Pin will be null after verification
    },
    passwordResetPinpinExpires: {
      type: DataTypes.DATE,
      allowNull: true, // Expiration date for the PIN
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Librarian", "Member"),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    paranoid: true,
    freezeTableName: true,
    modelName: "user_db",
  }
);

// Define associations separately
User.associate = (models) => {
  User.hasMany(models.BorrowRecord, {
    foreignKey: "user_id",
    as: "borrowRecords",
  });
};
module.exports = User;

/* Summary of Relationships
Author:
One Author has many Books.
Book:
Belongs to an Author.
Has many BorrowRecords.
User:
Has many BorrowRecords.
BorrowRecord:
Belongs to a User.
Belongs to a Book.
 */
