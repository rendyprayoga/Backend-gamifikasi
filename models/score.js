const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class Score extends Model {}

Score.init(
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
    modelName: 'Score',
  }
);

module.exports = Score;
