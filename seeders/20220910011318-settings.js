'use strict';
const Settings = require('../models/setting');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Settings.bulkCreate([
      {
        key: 'point.register',
        type: 'number',
        settingType: 'SYS_POINT',
        value: 0,
      },
      {
        key: 'point.claim',
        type: 'number',
        settingType: 'SYS_POINT',
        value: 0,
      },
      {
        key: 'point.completed-profile',
        type: 'number',
        settingType: 'SYS_POINT',
        value: 0,
      },
      {
        key: 'point.invite',
        type: 'number',
        settingType: 'SYS_POINT',
        value: 0,
      },
      {
        key: 'point.invitee-claim',
        type: 'number',
        settingType: 'SYS_POINT',
        value: 0,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Settings.destroy({
      where: {
        key: [
          'point.register',
          'point.claim',
          'point.invite',
          'point.completed-profile',
        ],
      },
    });
  },
};
