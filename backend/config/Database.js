const Sequelize = require('sequelize');

const db = new Sequelize('argon_hris', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = db;
