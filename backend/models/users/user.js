// models/user.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); // Adjust the path as necessary


const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active', // Default status is active
    },
    created_at: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});




module.exports = User;
