'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ip: DataTypes.STRING,
    number: DataTypes.INTEGER,
    result: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};