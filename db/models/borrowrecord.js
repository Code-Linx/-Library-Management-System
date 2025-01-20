'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BorrowRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BorrowRecord.init({
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER,
    borrowed_at: DataTypes.DATE,
    due_at: DataTypes.DATE,
    returned_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BorrowRecord',
  });
  return BorrowRecord;
};