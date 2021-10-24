'Use strict';
const express = require('express');
const monitorController = require('../monitor');
const envController = require('../environment');
const { validatePermission } = require('../auth');

const router = express.Router();
router.route('/environment/:envId/query/:qId').get(monitorController.runQuery);

module.exports = router;
