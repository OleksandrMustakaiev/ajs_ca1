const express = require('express');
const router = express.Router();

const { profile, register, login } = require('../controllers/user.controller');

router
    .post('/', profile)
    .post('/register', register)
    .post('/login', login)

module.exports = router;