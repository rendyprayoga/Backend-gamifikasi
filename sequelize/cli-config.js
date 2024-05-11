const config = require('../config');

module.exports = {
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
  seederStorage: 'sequelize',
};
