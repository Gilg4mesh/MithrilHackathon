'use strict';
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
      id: {
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(120)
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(120)
      },
      uuid: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(120)
      },
      grant_code: {
        unique: true,
        type: DataTypes.STRING(120)
      },
      state: {
        unique: true,
        type: DataTypes.STRING(120)
      },
      interest: {
        defaultValue: 0,
        type: DataTypes.DOUBLE
      },
      current_address: {
        unique: true,
        [Op.regexp]: '^0x[a-fA-F0-9]{40}$',
        type: DataTypes.STRING(120)
      }
  }, {})
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};