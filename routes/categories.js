const express = require('express');
const router = express.Router();

const { loginRequired } = require('../controllers/user.controller');

const { readData, readOne, createData, updateData, deleteData } = require('../controllers/category.controller');

router
    .get('/', readData)
    .get('/:id', readOne)
    .post('/', loginRequired, createData)
    .put('/:id', loginRequired, updateData)
    .delete('/:id', loginRequired, deleteData)

module.exports = router;