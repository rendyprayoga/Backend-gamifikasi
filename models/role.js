'use strict';

const _ = require('lodash');
const { DataTypes } = require('sequelize');
const yup = require('yup');
const Base = require('./base');
const User = require('./user');
const sequelize = require('../sequelize');

const pickPermissions = (permissions) => {
  const all = [
    { code: 'read', label: 'Read' },
    { code: 'create', label: 'Create' },
    { code: 'update', label: 'Update' },
    { code: 'delete', label: 'Delete' },
    { code: 'publish', label: 'Publish' },
  ];

  return permissions.map((code) => _.find(all, ['code', code]));
};

const pickValuePermissions = (permissions) => {
  const all = {
    read: true,
    create: true,
    update: true,
    delete: true,
    publish: true,
  };

  return _.pick(all, permissions);
};

class Role extends Base {
  static MODULES = [
    {
      code: 'reports',
      label: 'Report',
      permissions: pickPermissions(['read']),
    },
    {
      code: 'categories',
      label: 'Categories',
      permissions: pickPermissions(['read', 'create', 'update', 'delete']),
    },
    {
      code: 'questions',
      label: 'Questions',
      permissions: pickPermissions(['read', 'create', 'update', 'delete']),
    },
    {
      code: 'course',
      label: 'Course',
      permissions: pickPermissions(['read']),
    },
    {
      code: 'badge',
      label: 'Badge',
      permissions: pickPermissions(['read']),
    },
    {
      code: 'rank',
      label: 'Rank',
      permissions: pickPermissions(['read']),
    },
    {
      code: 'apis',
      label: 'APIs',
      permissions: pickPermissions(['read', 'create', 'delete']),
    },
    {
      code: 'roles',
      label: 'Roles',
      permissions: pickPermissions(['read', 'create', 'update', 'delete']),
    },
    {
      code: 'users',
      label: 'User CMS',
      permissions: pickPermissions(['read', 'create', 'update', 'delete']),
    },
  ];

  static searchable = ['name'];

  static syncAdminPermissions(permission = {}) {
    return _.merge(
      {
        categories: pickValuePermissions([
          'read',
          'create',
          'update',
          'delete',
        ]),
        questions: pickValuePermissions(['read', 'create', 'update', 'delete']),

        apis: pickValuePermissions(['read', 'create', 'delete']),
        users: pickValuePermissions(['read', 'create', 'update', 'delete']),
        roles: pickValuePermissions(['read', 'create', 'update', 'delete']),

        banners: pickValuePermissions(['read', 'update']),
        files: pickValuePermissions(['create']),
        tac: pickValuePermissions(['update']),
        submissions: pickValuePermissions(['read']),
        venues: pickValuePermissions(['read', 'create', 'update', 'delete']),
        vouchers: pickValuePermissions(['read', 'create', 'update', 'delete']),
        rewards: pickValuePermissions(['read', 'create', 'update', 'delete']),
      },
      permission
    );
  }

  static getValidator() {
    return yup.object().shape({
      name: yup.string().required(),
      permissions: yup.object().required(),
    });
  }
}

Role.init(
  {
    name: DataTypes.STRING,
    permissions: {
      type: DataTypes.JSON,
      get: function () {
        if (typeof this.getDataValue('permissions') === 'string') {
          return JSON.parse(this.getDataValue('permissions'));
        }
        return this.getDataValue('permissions');
      },
    },
  },
  {
    sequelize,
    modelName: 'Role',
  }
);

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

module.exports = Role;
