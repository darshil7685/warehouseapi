const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        manager_id: { type: DataTypes.INTEGER, allowNull: false },
        isActive: { type: DataTypes.BOOLEAN }
    };

    const options = {
        // defaultScope: {
        //     // exclude hash by default
        //     attributes: { exclude: ['hash'] }
        // },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}