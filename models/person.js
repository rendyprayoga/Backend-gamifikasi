'use strict';

const _ = require('lodash');
const { DataTypes } = require('sequelize');
const Base = require('./base');
const sequelize = require('../sequelize');
const hash = require('../utils/hash');
const bcrypt = require('bcrypt');
const yup = require('yup');
class Person extends Base {
  static SCENARIO_LOGIN = 'LOGIN';
  static SCENARIO_UPDATE = 'UPDATE';
  static searchable = ['name', 'email', 'phone'];
  static getValidator(scenario) {
    const name = yup.string().required();
    const email = yup.string().required();
    const password = yup.string().required();
    const confirmPassword = yup
      .string()
      .label('confirm password')
      .test(
        'confirmed',
        '${path} must match',
        (value, context) => value === context.parent.password
      );

    switch (scenario) {
      case this.SCENARIO_LOGIN:
        return yup.object().shape({ email, password });
      case this.SCENARIO_UPDATE:
        return yup.object().shape({ name, email });
      default:
        return yup
          .object()
          .shape({ name, email, password, confirmPassword, address });
    }
  }

  isPasswordValid(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

Person.init(
  {
    name: {
      type: DataTypes.STRING,
      set(value) {
        if (this.getDataValue('name') === value) return;
        this.setDataValue('name', hash.encrypt(String(value)));
      },
      get() {
        if (this.getDataValue('name'))
          return hash.decrypt(this.getDataValue('name'));
        return null;
      },
    },
    email: {
      type: DataTypes.STRING,
      set(value) {
        if (this.getDataValue('email') === value) return;
        this.setDataValue('email', hash.encrypt(String(value)));
      },
      get() {
        if (this.getDataValue('email')) {
          return hash.decrypt(this.getDataValue('email'));
        } else {
          return null;
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        if (this.getDataValue('password') === value) return;
        this.setDataValue('password', bcrypt.hashSync(String(value), 10));
      },
      get() {
        return this.getDataValue('password');
      },
    },
    phone: {
      type: DataTypes.STRING,
      set(value) {
        if (this.getDataValue('phone') === value) return;
        this.setDataValue('phone', hash.encrypt(String(value)));
      },
      get() {
        if (this.getDataValue('phone')) {
          return hash.decrypt(this.getDataValue('phone'));
        } else {
          return null;
        }
      },
    },
    dob: DataTypes.DATE,
    gender: DataTypes.ENUM(['M', 'F']),
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'Person',
  }
);

module.exports = Person;
