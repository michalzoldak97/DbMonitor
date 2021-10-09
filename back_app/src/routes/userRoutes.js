const express = require('express');
const { createUser, getUser } = require('../user');
const { login, validateToken, validatePermission } = require('../auth');

const router = express.Router();

router.post('/login', login);

router
  .route('/:id')
  .get(validateToken, validatePermission('userView'), getUser);

router
  .route('/')
  .post(validateToken, validatePermission('userCreate'), createUser);

module.exports = router;
