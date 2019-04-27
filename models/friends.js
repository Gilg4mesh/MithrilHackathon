'use strict';
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const Friends = sequelize.define('friends', {
      id: {
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      friend_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
  }, {})
  Friends.associate = function(models) {
    // associations can be defined here
  };
  return Friends;
};