'use strict';

const _ = require('lodash');
const Role = require('../models/role');

const pickPermissions = (permissions) => {
  const all = {
    read: true,
    create: true,
    update: true,
    delete: true,
    publish: true,
  };

  return _.pick(all, permissions);
};

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

    const admin = await Role.findOne({ where: { name: 'Admin' } }).then(
      (admin) => admin || new Role({ name: 'Admin' })
    );
    admin.permissions = _.merge(
      {
        apis: pickPermissions(['read', 'create', 'delete']),
        files: pickPermissions(['create']),
        roles: pickPermissions(['read', 'create', 'update', 'delete']),
        tac: pickPermissions(['update']),
        users: pickPermissions(['read', 'create', 'update', 'delete']),
      },
      admin.permissions
    );

    await admin.save();
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
