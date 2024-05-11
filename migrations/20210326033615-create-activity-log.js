'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ActivityLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      userId: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'Users', key: 'id' },
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      key: {
        type: Sequelize.TEXT,
      },
      data: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ActivityLogs');
  },
};
