const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class Point extends Model {}

Point.init(
  {
    value: DataTypes.INTEGER,
    userId: {
      type: DataTypes.BIGINT,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Point',
  }
);

module.exports = Point;
