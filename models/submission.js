'use strict';

const _ = require('lodash');
const { DataTypes } = require('sequelize');
const Base = require('./base');
const sequelize = require('../sequelize');
const yup = require('yup');
const Api = require('./api');
const User = require('./user');
const Category = require('./category');

class Submission extends Base {}

Submission.init(
  {
    categoryId: DataTypes.BIGINT,
    userId: DataTypes.BIGINT,
    score: DataTypes.INTEGER,
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'Submission',
  }
);
User.hasMany(Submission, { foreignKey: 'userId' });
Submission.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Submission, { foreignKey: 'categoryId' });
Submission.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Submission;
