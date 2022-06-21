const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize')
const warehouseService = require('./warehouse.service');

// routes

router.post('/register', registerSchema, register);
router.put('/:id', updateSchema, update);
router.get('/', getAll);
router.get('/countWarehouses', countAll);
router.get('/:name', getByName);
router.get('/getById/:id', getById);
router.delete('/:id', _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    warehouseService.create(req.body)
        .then(() => res.json({ message: 'Warehouse Registration successful' }))
        .catch(next);
}
function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        location: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function getAll(req, res, next) {
    warehouseService.getAll()
        .then(users => res.json(users))
        .catch(next);
}
function countAll(req, res, next) {
    warehouseService.countAll()
        .then(count => res.json(count))
        .catch(next);
}
function getByName(req, res, next) {
    warehouseService.getByName(req.params.name)
        .then(user => res.json(user))
        .catch(next);
}
function getById(req, res, next) {
    warehouseService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}


function update(req, res, next) {
    warehouseService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    warehouseService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}
