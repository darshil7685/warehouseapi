var Sequelize = require('sequelize');

var sequelize = new Sequelize('excel_demo', 'root', 'infozium', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

exports.sequelize = sequelize;
module.exports = Sequelize;