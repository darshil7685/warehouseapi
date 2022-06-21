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
    const user = await db.User.findOne({ where: { email } });
    if (user.isActive == false) {
        throw 'you are blocked';
    }

    if (!user || !(await password == user.password))
        throw 'email or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

function getAll(req) {
    let promise = new Promise((resolve, reject) => {
        const manager_id = req.body.manager_id;

        if (!manager_id) {
            db1.query(`select u.id,u.name,u.email,u.password,u.isActive,u.location,m.name"manager_name" from Users u left join Managers m on u.manager_id=m.id `, (err, result) => {
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
        } else {
            db1.query(`select u.id,u.name,u.email,u.password,u.isActive,u.location from Users u left join Managers m on u.manager_id=m.id where u.manager_id=?`, [manager_id], (err, result) => {
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
        }
    });
    return promise;
}

async function countAll() {
    return await db.User.count();
}

async function getByName(name) {
    const users = await db.User.findAll({ where: { name: name } })
    return users;
}

async function getById(id) {
    const user = await getUser(id)
    return user;
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // save user
    await db.User.create(params);
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    // if (params.password) {
    //     params.hash = await bcrypt.hash(params.password, 10);
    // }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    // const { hash, ...userWithoutHash } = user;
    return user;
}
async function block(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    if (user.isActive == false) {
        throw 'User already blocked';
    }
    user.isActive = false;
    await user.save();
}
async function unblock(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    if (user.isActive == true) {
        throw 'User already unblocked';
    }
    user.isActive = true;
    await user.save();
}   
