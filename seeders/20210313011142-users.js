'use strict';

const Role = require('../models/role');
const User = require('../models/user');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    if (!process.env.DB_SEED_USER) {
      throw new Error('DB_SEED_USER environment variable not defined');
    }

    const role = await Role.findOne();
    const data = JSON.parse(process.env.DB_SEED_USER);
    const user = await User.findOne({ where: { email: data.email } });

    if (!user) await User.create({ roleId: role.id, ...data });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
