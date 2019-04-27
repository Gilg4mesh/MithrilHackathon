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
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      uuid: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      grant_code: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      state: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
      }
  }, {})
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};