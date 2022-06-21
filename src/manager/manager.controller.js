const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize')
const managerService = require('./manager.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', getAll);
router.get('/countManagers', countAll);
router.get('/current', getCurrent);
router.get('/:name', getByName);
router.put('/updateById/:id', updateSchema, update);
router.get('/getById/:id', getById)
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
    managerService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        warehouse_id: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    managerService.create(req.body)
        .then(() => res.json({ message: 'warehouse Manager Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    managerService.getAll()
        .then(users => res.json(users))
        .catch(next);
}
function countAll(req, res, next) {
    managerService.countAll()
        .then(count => res.json(count))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getByName(req, res, next) {
    managerService.getByName(req.params.name)
        .then(user => res.json(user))
        .catch(next);
}
function getById(req, res, next) {
    managerService.getById(req.params.id)
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
    managerService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    managerService.delete(req.params.id)
        .then(() => res.json({ message: 'Manager deleted successfully' }))
        .catch(next);
}
function block(req, res, next) {
    managerService.block(req.params.id)
        .then(() => res.json({ message: 'Manager has been blocked' }))
        .catch(next);
}

function unblock(req, res, next) {
    managerService.unblock(req.params.id)
        .then(() => res.json({ message: 'Manager has been unblocked' }))
        .catch(next);
}
