"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Author = sequelize.define(
  "author",
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
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    birthdate: {
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
    modelName: "author",
  }
);

// Define associations separately
Author.associate = (models) => {
  Author.hasMany(models.Book, {
    foreignKey: "author_id",
    as: "books",
  });
};

module.exports = Author;
