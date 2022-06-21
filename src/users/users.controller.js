const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize')
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.post('/', getAll);
router.get('/countUsers', countAll);
router.get('/current', getCurrent);
router.get('/:name', getByName);
router.get('/getById/:id', getById);
router.put('/update/:id', updateSchema, update);
router.delete('/:id', _delete);
router.put('/block/:id', block);
router.put('/unblock/:id', unblock);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        manager_id: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'DeliveryBoy Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll(req)
        .then(users => res.json(users))
        .catch(next);
}
function countAll(req, res, next) {
    userService.countAll()
        .then(count => res.json(count))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getByName(req, res, next) {
    userService.getByName(req.params.name)
        .then(user => res.json(user))
        .catch(next);
}
function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}


function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        location: Joi.string().empty(''),
        email: Joi.string().empty(''),
        password: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}
function block(req, res, next) {
    userService.block(req.params.id)
        .then(() => res.json({ message: 'User has been blocked' }))
        .catch(next);
}
function unblock(req, res, next) {
    userService.unblock(req.params.id)
        .then(() => res.json({ message: 'User has been unblocked' }))
        .catch(next);
}