'use strict';
const express = require('express');
const queryController = require('../query');
const { validatePermission } = require('../auth');

const router = express.Router();
router.route('/:id').get(validatePermission('qView'), queryController.getQuery);

module.exports = router;
