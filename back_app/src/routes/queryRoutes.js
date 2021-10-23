'use strict';
const express = require('express');
const queryController = require('../query');
const { validatePermission } = require('../auth');

const router = express.Router();

router.get('/', validatePermission('qView'), queryController.getQueryAll);
router.post('/', validatePermission('qCreate'), queryController.createQuery);

router
  .route('/user')
  .post(validatePermission('userModifyQuery'), queryController.assignQueries)
  .delete(
    validatePermission('userModifyQuery'),
    queryController.unassignQueries
  );

router
  .route('/:id')
  .get(validatePermission('qView'), queryController.getQuery)
  .patch(validatePermission('qModify'), queryController.modifyQuery)
  .delete(validatePermission('qDelete'), queryController.deleteQuery);

module.exports = router;
