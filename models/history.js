'use strict';
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('history', {
      id: {
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      game_addr: {
        allowNull: false,
        [Op.regexp]: '^0x[a-fA-F0-9]{40}$',
        type: DataTypes.STRING(120)
      },
      user_addr: {
        allowNull: false,
        [Op.regexp]: '^0x[a-fA-F0-9]{40}$',
        type: DataTypes.STRING(120)
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      reward: {
        defaultValue: 0,
        type: DataTypes.DOUBLE
      },
      done: {
        defaultValue: 0,
        type: DataTypes.BOOLEAN
      }
  }, {})
  History.associate = function(models) {
    // associations can be defined here
  };
  return History;
};