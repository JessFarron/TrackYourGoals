const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Verification extends Model {}

Verification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        code: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {       
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'verification',
    }
);

module.exports = Verification;
