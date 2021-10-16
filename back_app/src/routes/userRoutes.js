'use strict';
const express = require('express');
const { user } = require('../user');
const { login, validateToken, validatePermission } = require('../auth');

const router = express.Router();

router.post('/login', login);

router.use(validateToken);

router.get('/mysetup', user.getMySetup);

router.get(
  '/:id/setup',
  validatePermission('userViewDetail'),
  user.getUserSetup
);

router.patch(
  '/updatePass',
  validatePermission('userModifyDetail'),
  user.modifyPass
);

router
  .route('/')
  .get(validatePermission('userViewDetail'), user.getUserAll)
  .post(validatePermission('userCreate'), user.createUser);

router
  .route('/:id')
  .get(validatePermission('userViewDetail'), user.getUser)
  .delete(validatePermission('userDelete'), user.deleteUser);

module.exports = router;
