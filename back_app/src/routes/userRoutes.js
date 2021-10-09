const express = require('express');
const { createUser, getUser } = require('../user');
const { login, validateToken } = require('../auth');

const router = express.Router();

router.post('/login', login);

router.route('/:id').get(validateToken, getUser);

router.route('/').post(validateToken, createUser);

module.exports = router;
