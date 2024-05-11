'use strict';

const { DataTypes } = require('sequelize');
const Base = require('./base');
const sequelize = require('../sequelize');

class ActivityLog extends Base {}

ActivityLog.init(
  {
    userId: DataTypes.BIGINT,
    type: DataTypes.STRING,
    key: DataTypes.STRING,
    data: DataTypes.JSON,
  },
  {
    sequelize,
    modelName: 'ActivityLog',
    updatedAt: false,
  }
);

module.exports = ActivityLog;
