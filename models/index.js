const db = require('../db');
const UserModel = require('./user');
const ArtModel = require('./art');

module.exports = {
    dbConnection: db,
    UserModel,
    ArtModel
};

ArtModel.belongsTo(UserModel, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
UserModel.hasMany(ArtModel, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});