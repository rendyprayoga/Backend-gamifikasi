'use strict';

const _ = require('lodash');
const { DataTypes } = require('sequelize');
const Base = require('./base');
const sequelize = require('../sequelize');
const yup = require('yup');
const Category = require('./category');

class Question extends Base {
  static searchable = ['questionText'];
  static getValidator() {
    return yup.object().shape({
      categoryId: yup.number().required(),
      questionText: yup.string().required(),
    });
  }
}

Question.init(
  {
    categoryId: DataTypes.BIGINT,
    questionText: DataTypes.TEXT,
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'Question',
  }
);
Category.hasMany(Question, { foreignKey: 'categoryId' });
Question.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Question;
