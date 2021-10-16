'use strict';
const user = require('./userController');

module.exports = {
  user: {
    createUser: user.createUser,
    getUser: user.getUser,
    getUserAll: user.getUserAll,
    deleteUser: user.deleteUser,
    modifyPass: user.modifyPass,
    getMySetup: user.getMySetup,
    getUserSetup: user.getUserSetup
  }
};
