'use strict';
const {
  login,
  validateToken,
  validatePermission
} = require('./authController');

module.exports = {
  login,
  validateToken,
  validatePermission
};
