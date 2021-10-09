const express = require('express');
const { createUser, getUser } = require('../user');
const { login } = require('../auth');

const router = express.Router();

router.post('/login', login);

router.route('/:id').get(getUser);

router.route('/').post(createUser);

module.exports = router;
