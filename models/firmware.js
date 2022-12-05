'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Firmware extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Firmware.init({
    version: DataTypes.STRING,
    states: {
      type: DataTypes.ENUM,
      values: ['LOCK'],
      defaultValue:'LOCK'
    },
    bIsDeleted:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    releaseNote: DataTypes.STRING,
    filePath: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Firmware',
  });
  return Firmware;
};