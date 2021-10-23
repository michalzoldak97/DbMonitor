'use strict';
const express = require('express');
const queryController = require('../query');
const { validatePermission } = require('../auth');

const router = express.Router();

router.get('/', validatePermission('qView'), queryController.getQueryAll);
router.post('/', validatePermission('qCreate'), queryController.createQuery);

// router
//   .route('/user')
//   .post(validatePermission('userModifyEnv'), queryController.assignEnvs)
//   .delete(validatePermission('userModifyEnv'), queryController.unassignEnvs);

router.route('/:id').get(validatePermission('qView'), queryController.getQuery);

module.exports = router;
