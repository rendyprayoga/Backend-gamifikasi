'use strict';

const { DataTypes } = require('sequelize');
const yup = require('yup');
const Base = require('./base');
const sequelize = require('../sequelize');
const hash = require('./../utils/hash');

class Api extends Base {
  static searchable = ['name'];

  static getValidator() {
    return yup.object().shape({
      name: yup.string().required(),
      description: yup.string(),
    });
  }
}

Api.init(
  {
    name: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('name', value);
        this.setDataValue('key', hash.generateKey(value));
      },
    },
    description: DataTypes.STRING,
    key: DataTypes.STRING,
  },
  {
    paranoid: true,
    sequelize,
    modelName: 'Api',
  }
);

module.exports = Api;
