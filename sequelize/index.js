const dayjs = require('dayjs')
const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    dialect: 'mysql',
    host: config.db.host,
    port: config.db.port,
    timezone: '+07:00',
  }
);

module.exports = sequelize;
