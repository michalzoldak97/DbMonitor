const express = require('express');
const processController = require('./../process/processController');

const router = express.Router();

router.route('/checkdb').get(processController.checkDatabase);

router.route('/checkdbinter').get(processController.checkInternalDatabase);

module.exports = router;
