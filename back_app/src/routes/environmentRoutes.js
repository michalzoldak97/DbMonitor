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
  .route('/:id')
  .get(validatePermission('envView'), envController.getEnvironment);

module.exports = router;
