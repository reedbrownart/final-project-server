const db = require('../db');
const UserModel = require('./user');
const ArtModel = require('./art');
const ReviewModel = require('./review');

module.exports = {
    dbConnection: db,
    UserModel,
    ArtModel,
    ReviewModel
};

ArtModel.belongsTo(UserModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

ArtModel.hasMany(ReviewModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

ReviewModel.belongsTo(UserModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
ReviewModel.belongsTo(ArtModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

UserModel.hasMany(ReviewModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
UserModel.hasMany(ArtModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });