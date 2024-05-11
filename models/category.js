'use strict';

const _ = require('lodash');
const { DataTypes } = require('sequelize');
const Base = require('./base');
const sequelize = require('../sequelize');
const yup = require('yup');

class Category extends Base {
  static searchable = ['name'];
  static getValidator() {
    return yup.object().shape({
      name: yup.string().required(),
    });
  }
}

Category.init(
  {
    name: DataTypes.STRING,
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'Category',
  }
);

module.exports = Category;
