"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Book = sequelize.define(
  "book",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Available", "Borrowed"),
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
    modelName: "book",
  }
);

// Define associations separately
Book.associate = (models) => {
  Book.belongsTo(models.Author, {
    foreignKey: "author_id",
    as: "author",
  });
  Book.hasMany(models.BorrowRecord, {
    foreignKey: "book_id",
    as: "borrowRecords",
  });
};

module.exports = Book;
