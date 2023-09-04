const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Objective extends Model { }

Objective.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        target_quantity: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        image_path: {
            type: DataTypes.STRING,
            allowNull:true
        },
        description: {
            type: DataTypes.STRING,
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }        
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'objective',
    }
);

module.exports = Objective;
