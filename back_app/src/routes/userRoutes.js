const express = require('express');
const {
  createUser,
  getUser,
  getUserAll,
  deleteUser,
  modifyPass
} = require('../user');
const { login, validateToken, validatePermission } = require('../auth');

const router = express.Router();

router
  .route('/')
  .get(validateToken, validatePermission('userView'), getUserAll)
  .post(validateToken, validatePermission('userCreate'), createUser);

router
  .route('/:id')
  .get(validateToken, validatePermission('userView'), getUser)
  .delete(validateToken, validatePermission('userDelete'), deleteUser);

router.post('/login', login);

router
  .route('/updatePass')
  .patch(validateToken, validatePermission('userModify'), modifyPass);

module.exports = router;
