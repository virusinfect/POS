// models/Role.js
const {DataTypes} = require('sequelize');
const sequelize = require('../../config/db');

const Role = sequelize.define('Role', {
        name: {type: DataTypes.STRING, allowNull: false},
    }
    , {
        tableName: 'roles', // Ensure this matches your actual table name
        underscored: true,
    });

module.exports = Role;


