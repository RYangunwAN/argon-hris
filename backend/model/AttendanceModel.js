const Sequelize = require('sequelize');
const db = require('../config/Database.js');
const { DataTypes } = Sequelize;
const Users = require('./UserModel.js'); 

const Attendance = db.define('attendance', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    checkIn: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    checkOut: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    photo: {
        type: DataTypes.BLOB('long'), 
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: Users,
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
}, {
    freezeTableName: true,
    timestamps: true,
});


Users.hasMany(Attendance, { foreignKey: 'userId' });
Attendance.belongsTo(Users, { foreignKey: 'userId' });

module.exports = Attendance;
