const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:c5517d138be14fb68affbb9b58e38b16@localhost:5432/gif-gallery-database");

module.exports = sequelize;