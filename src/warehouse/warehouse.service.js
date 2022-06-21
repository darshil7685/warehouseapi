const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

module.exports = {
    getAll,
    countAll,
    getByName,
    getById,
    create,
    update,
    delete: _delete,
};


async function getAll() {
    return await db.Warehouse.findAll();
}
async function countAll() {
    return await db.Warehouse.count();
}
async function getByName(name) {
    const user = await db.Warehouse.findAll({ where: { name: name } })
    return user;
}
async function getById(id) {
    const warehouse = await getWarehouse(id);
    return warehouse;
}

async function create(params) {
    // validate
    if (await db.Warehouse.findOne({ where: { name: params.name } })) {
        throw 'name "' + params.name + '" is already taken';
    }

    // save warehouse
    await db.Warehouse.create(params);
}

async function update(id, params) {
    const warehouse = await getWarehouse(id);

    // validate
    const nameChanged = params.name && warehouse.name !== params.name;
    if (nameChanged && await db.Warehouse.findOne({ where: { name: params.name } })) {
        throw 'name "' + params.name + '" is already taken';
    }

    // copy params to warehouse and save
    Object.assign(warehouse, params);
    return await warehouse.save();

}

async function _delete(id) {
    const warehouse = await getWarehouse(id);
    await warehouse.destroy();
}

// helper functions

async function getWarehouse(id) {
    const warehouse = await db.Warehouse.findByPk(id);
    if (!warehouse) throw 'warehouse not found';
    return warehouse;
}

