'use strict';
const Api = require('./api');
const User = require('./user');
const Category = require('./category');
const _ = require('lodash');
const { DataTypes } = require('sequelize');
const Base = require('./base');
const sequelize = require('../sequelize');
const yup = require('yup');

class Rank extends Base {}
Rank.init(
  {
    categoryId: DataTypes.BIGINT,
    userId: DataTypes.BIGINT,
    score: DataTypes.INTEGER,
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'Rank',
  }
);
User.hasMany(Rank, { foreignKey: 'userId' });
Rank.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Rank, { foreignKey: 'categoryId' });
Rank.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Rank;
