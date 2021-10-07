const express = require('express');
const processController = require('../process/processControler');

const router = express.Router();

router.route('/checkdb').get(processController.checkDatabase);

module.exports = router;
