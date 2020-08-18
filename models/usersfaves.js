'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersFaves extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  usersFaves.init({
    userId: DataTypes.INTEGER,
    faveId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usersFaves',
  });
  return usersFaves;
};