const express = require('express');
const { createUser, getUser } = require('../user');

const router = express.Router();

router.route('/:id').get(getUser);

router.route('/').post(createUser);

module.exports = router;
