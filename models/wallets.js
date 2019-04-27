'use strict';
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const Wallets = sequelize.define('wallets', {
      id: {
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      address: {
        unique: true,
        allowNull: false,
        [Op.regexp]: '^0x[a-fA-F0-9]{40}$',
        type: DataTypes.STRING
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
  }, {});
  Wallets.associate = function(models) {
    // associations can be defined here
  };
  return Wallets;
};