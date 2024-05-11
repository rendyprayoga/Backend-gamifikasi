'use strict';
const Settings = require('../models/setting');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Settings.bulkCreate([
      {
        key: 'setting.tnc',
        type: 'text',
        settingType: 'SYS_PARAM',
        value: '',
      },
      {
        key: 'setting.privacy',
        type: 'text',
        settingType: 'SYS_PARAM',
        value: '',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Settings.destroy({
      where: { key: ['setting.tnc', 'setting.privacy'] },
    });
  },
};
