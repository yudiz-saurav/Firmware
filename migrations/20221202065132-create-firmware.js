'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Firmwares', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      version: {
        type: Sequelize.STRING
      },
      states: {
        type: Sequelize.ENUM,
        values: ['LOCK'],
        defaultValue:'LOCK'
      },
      bIsDeleted:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      releaseNote: {
        type: Sequelize.STRING
      },
      filePath: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Firmwares');
  }
};