'use strict';

const bcrypt = require('bcrypt');
const get = require('lodash/get');
const { DataTypes } = require('sequelize');
const yup = require('yup');
const sequelize = require('../sequelize');
const ActivityLog = require('./activitylog');
const Base = require('./base');

class User extends Base {
  static SCENARIO_LOGIN = 'LOGIN';
  static SCENARIO_UPDATE = 'UPDATE';

  static searchable = ['name', 'email'];

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
        return yup.object().shape({ name, email, password, confirmPassword });
    }
  }

  can(permission) {
    return this.Role && get(this.Role.permissions, permission);
  }

  isPasswordValid(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

User.init(
  {
    roleId: DataTypes.BIGINT,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    avg_score: DataTypes.VIRTUAL,
    password: {
      type: DataTypes.STRING,
      set(value) {
        if (value) this.setDataValue('password', bcrypt.hashSync(value, 10));
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: { attributes: {} },
    },
  }
);

User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
