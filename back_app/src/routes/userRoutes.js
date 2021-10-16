'use strict';
const express = require('express');
const { user } = require('../user');
const { login, validateToken, validatePermission } = require('../auth');

const router = express.Router();

router.post('/login', login);

router.use(validateToken);

router.route('/mysetup').get(user.getUserSetup);

router
  .route('/updatePass')
  .patch(validatePermission('userModify'), user.modifyPass);

router
  .route('/')
  .get(validatePermission('userView'), user.getUserAll)
  .post(validatePermission('userCreate'), user.createUser);

router
  .route('/:id')
  .get(validatePermission('userView'), user.getUser)
  .delete(validatePermission('userDelete'), user.deleteUser);

module.exports = router;
