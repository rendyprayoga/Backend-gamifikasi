'use strict';

const _ = require('lodash');
const { DataTypes } = require('sequelize');
const Base = require('./base');
const sequelize = require('../sequelize');
const yup = require('yup');
const Question = require('./question');

class Answer extends Base {
  static searchable = ['answerText'];
  static getValidator() {
    return yup.object().shape({
      data: yup.array(
        yup.object({
          questionId: yup.number().required(),
          answerText: yup.string().required(),
          isTrue: yup.boolean().default(false),
        })
      ),
    });
  }
}

Answer.init(
  {
    questionId: DataTypes.BIGINT,
    answerText: DataTypes.STRING,
    isTrue: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'Answer',
  }
);
Question.hasMany(Answer, { foreignKey: 'questionId' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

module.exports = Answer;
