const Sequelize = require('sequelize');
const db = require('../config/Database.js');
const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true, 
        validate: {
            isEmail: true 
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    role: {
        type: DataTypes.ENUM('member', 'admin'), 
        defaultValue: 'member',
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = Users;
