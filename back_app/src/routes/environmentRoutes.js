'use strict';
const express = require('express');
const envController = require('../environment');
const { validatePermission } = require('../auth');

const router = express.Router();

router.get('/', validatePermission('envView'), envController.getEnvironmentAll);
router.post(
  '/',
  validatePermission('envCreate'),
  envController.createEnvironment
);

router
  .route('/user')
  .post(validatePermission('userModifyEnv'), envController.assignEnvs)
  .delete(validatePermission('userModifyEnv'), envController.unassignEnvs);

router
  .route('/:id')
  .get(validatePermission('envView'), envController.getEnvironment)
  .patch(validatePermission('envModify'), envController.modifyEnvironment)
  .delete(validatePermission('envDelete'), envController.deleteEnv);

module.exports = router;
