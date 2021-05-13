const { DataTypes } = require('sequelize');
const db = require('../db');

const Art = db.define('art', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
        allowNull: false
    },
    audio: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

module.exports = Art;