const express = require('express');
const processController = require('./../process/processController');

const router = express.Router();

router.route('/checkdb').get(processController.checkDatabase);

module.exports = router;
