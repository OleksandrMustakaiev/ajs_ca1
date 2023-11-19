const express = require('express');
const router = express.Router();

const { loginRequired } = require('../controllers/user.controller');

const imageUpload = require('../configs/imageUploadAuthor');

const { readData, readOne, createData, updateData, deleteData } = require('../controllers/author.controller');


router
    .get('/', readData)
    .get('/:id', readOne)
    .post('/', imageUpload.single('image'), loginRequired, createData)
    .put('/:id', imageUpload.single('image'), loginRequired, updateData)
    .delete('/:id', loginRequired, deleteData)

module.exports = router;