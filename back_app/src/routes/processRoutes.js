'use strict';
const express = require('express');
const { checkDatabase, checkInternalDatabase } = require('./../process');

const router = express.Router();

router.route('/checkdb').get(checkDatabase);

router.route('/checkdbinter').get(checkInternalDatabase);

module.exports = router;
