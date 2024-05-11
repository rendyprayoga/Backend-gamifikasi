'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'People',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING(225),
        },
        email: {
          allowNull: true,
          type: Sequelize.STRING(225),
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        phone: {
          allowNull: true,
          type: Sequelize.STRING(20),
        },
        gender: {
          allowNull: true,
          type: Sequelize.ENUM,
          values: ['M', 'F'],
        },
        dob: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NULL ON UPDATE CURRENT_TIMESTAMP'),
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          Items_unique: {
            fields: ['email', 'phone'],
          },
        },
      }
    );
    await queryInterface.addIndex('People', ['email', 'phone']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('People');
  },
};
