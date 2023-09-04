const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Recovery extends Model {}

Recovery.init(
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
        modelName: 'recovery',
    }
);

module.exports = Recovery;
