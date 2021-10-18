'use strict';
const express = require('express');
const envController = require('../environment');
const { validatePermission } = require('../auth');

const router = express.Router();

router.get(
  '/all',
  validatePermission('envView'),
  envController.getEnvironmentAll
);

router
  .route('/user')
  .post(validatePermission('userModifyEnv'), envController.assignEnvs);

router
  .route('/:id')
  .get(validatePermission('envView'), envController.getEnvironment)
  .patch(validatePermission('envModify'), envController.modifyEnvironment);

router.post(
  '/',
  validatePermission('envCreate'),
  envController.createEnvironment
);

module.exports = router;
