const { DataTypes } = require('sequelize');
const db = require('../db');

const Review = db.define('review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Review;