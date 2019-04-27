'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var configObj = require(__dirname + '/../config/config.json');
var config    = configObj[env];
var db        = {};

// custom configurations

config.define = {
    // no plural form please
    freezeTableName: true,
    // convert the default column names to `*_by`, `*_id`
    // to be differentiate column names with their decorations
    underscored: true,
    // use utf-8
    collate: 'utf8mb4_unicode_ci'
};

// to surpress warning
config.operatorsAliases = false,
// turn off logging if not debugging
config.logging = (configObj.DB_LOGGING != null ? configObj.DB_LOGGING : env == 'development') ? console.log : false

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    // a hack to use Java-style name for classes
    var modelName = model.name[0].toUpperCase() + model.name.slice(1);
    db[modelName] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.db = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
