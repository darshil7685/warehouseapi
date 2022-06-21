const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const db1 = require("../order/db.js")

module.exports = {
    authenticate,
    getAll,
    countAll,
    getByName,
    getById,
    create,
    update,
    delete: _delete,
    block,
    unblock
};

async function authenticate({ email, password }) {
    const manager = await db.Manager.findOne({ where: { email } });
    if (manager.isActive == false) {
        throw 'you are blocked';
    }
    if (!manager || !(await password == manager.password))
        throw 'email or password is incorrect';

    // authentication successful

    const token = jwt.sign({ sub: manager.id }, config.secret, { expiresIn: '7d' });

    return { ...omitHash(manager.get()), token }
}

function getAll() {
    let promise = new Promise((resolve, reject) => {
        db1.query(`select m.id,m.name,m.email,m.password,m.isActive,m.location,w.name"warehouse_name" from Managers m left join Warehouses w  on w.id=m.warehouse_id `, (err, result) => {
            if (err) reject(err);
            result.forEach((result1) => {
                if (result1.isActive == 1) {
                    result1.isActive = true
                } else if (result1.isActive == 0) {
                    result1.isActive = false
                }
            })
            resolve(result);
        })
    });
    return promise;
}
async function countAll() {
    return await db.Manager.count();
}

async function getByName(name) {
    const users = await db.Manager.findAll({ where: { name: name } })
    return users;
}
async function getById(id) {
    const manager = await getManager(id)
    return manager;
}

async function create(params) {
    // validate
    if (await db.Manager.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // save manager
    await db.Manager.create(params);
}

async function update(id, params) {
    const manager = await getManager(id);

    // validate
    const emailChanged = params.email && manager.email !== params.email;
    if (emailChanged && await db.Manager.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    // if (params.password) {
    //     params.hash = await bcrypt.hash(params.password, 10);
    // }

    // copy params to manager and save
    Object.assign(manager, params);
    await manager.save();

    return omitHash(manager.get());
}

async function _delete(id) {
    const manager = await getManager(id);
    await manager.destroy();
}

// helper functions

async function getManager(id) {
    const manager = await db.Manager.findByPk(id);
    if (!manager) throw 'manager not found';
    return manager;
}

function omitHash(manager) {
    //const { hash, ...managerWithoutHash } = manager;
    return manager;
}
async function block(id) {
    const manager = await db.Manager.findByPk(id);
    if (!manager) throw 'manager not found';
    if (manager.isActive == false) {
        throw 'manager already blocked';
    }
    manager.isActive = false;
    await manager.save();
}
async function unblock(id) {
    const manager = await db.Manager.findByPk(id);
    if (!manager) throw 'manager not found';
    if (manager.isActive == true) {
        throw 'manager already unblocked';
    }
    manager.isActive = true;
    await manager.save();
}