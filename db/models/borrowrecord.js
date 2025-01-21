"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const BorrowRecord = sequelize.define(
  "borrowRecord",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrowed_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    due_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returned_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: "borrowRecord",
  }
);

// Define associations separately
BorrowRecord.associate = (models) => {
  BorrowRecord.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });
  BorrowRecord.belongsTo(models.Book, {
    foreignKey: "book_id",
    as: "book",
  });
};

module.exports = BorrowRecord;
