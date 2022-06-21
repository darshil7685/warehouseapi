const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const jwt = require('jsonwebtoken');
const db = require('../_helpers/db');
const config = require('../config.json');
const bcrypt = require("bcryptjs")

// routes
router.post('/authenticate',  authenticate);
router.post('/register', registerSchema, create)

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}
function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    authenticate1(req.body)
        .then(user => res.json(user))
        .catch(next);
}
function create(req, res, next) {
    create1(req.body)
        .then(() => res.json({ message: "Admin has been registerd" }))
        .catch(next);
}
async function authenticate1(data) {
    console.log(data.email);
    const admin = await db.Admin.findOne({ where: { email:data.email } });

    if (!admin || !(await bcrypt.compare(data.password, admin.password)))
        throw 'email or password is incorrect or you are not admin';

    // authentication successful
    const token = jwt.sign({ sub: admin.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash((admin.get())), token };
}

async function create1(params) {

    // save manager
    const { email, password } = params;
    if (await db.Admin.findOne({ where: { email: email } })) {
        throw 'email "' + email + '" is already taken';
    }

    // hash password
    if (password) {
        params.password = await bcrypt.hash(password, 10);
    }
    await db.Admin.create(params);

}
function omitHash(admin) {
    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
}