const config = require('../config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

initialize();
module.exports = db = {};
async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.Manager = require('../manager/manager.model')(sequelize);
    db.Warehouse = require('../warehouse/warehouse.model')(sequelize);
    db.Admin = require('../admin/admin.model')(sequelize);
    db.importData = require('../importData/importData.model').sequelize;

    // sync all models with database
    await sequelize.sync();
}