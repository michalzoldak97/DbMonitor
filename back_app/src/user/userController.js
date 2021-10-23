'use strict';
const { catchAsync } = require('../error');
const bcrypt = require('bcrypt');
const userModel = require('./userModel');
const { responseHandler, isValidEmail, isValidPasword } = require('../utils');

exports.getUser = catchAsync(async (req, res, next) => {
  const getConfig = {
    id: 'user_id',
    scope: 'restricted',
    val: req.params.id
  };
  const user = await userModel.selectUser(getConfig);
  responseHandler.respond(
    { head: user, data: user },
    { sCode: 200, errCode: 404, errMessage: 'userNotFound' },
    res,
    next
  );
});

exports.getUserAll = catchAsync(async (req, res, next) => {
  const getConfig = {
    scope: 'restricted'
  };
  const users = await userModel.selectUsers(getConfig);
  responseHandler.respond(
    { head: users, data: users },
    { sCode: 200, errCode: 404, errMessage: 'userNotFound' },
    res,
    next
  );
});

exports.createUser = catchAsync(async (req, res, next) => {
  if (
    !req.body.creatingUserId ||
    !isValidEmail(req.body.email) ||
    !isValidPasword(req.body.password)
  ) {
    req.body = null;
  }
  const newUser = await userModel.insertUser(req);
  responseHandler.respond(
    { head: newUser.rowCount, data: newUser.rowCount },
    { sCode: 201, errCode: 500, errMessage: 'userCreateFail' },
    res,
    next
  );
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const qConfig = {
    id: 'user_id',
    toChange: 'deactivated_datetime',
    val: new Date(Date.now()),
    condition: req.params.id
  };
  const changedUsers = await userModel.updateUser(qConfig);
  responseHandler.respond(
    { head: changedUsers, data: changedUsers },
    { sCode: 200, errCode: 404, errMessage: 'userNotFound' },
    res,
    next
  );
});

exports.modifyPass = catchAsync(async (req, res, next) => {
  const newPass = await bcrypt.hash(req.body.newPassword, 12);
  const qConfig = {
    id: 'user_id',
    toChange: 'password',
    val: newPass,
    condition: req.body.id
  };
  const changedUsers = await userModel.updateUser(qConfig);
  responseHandler.respond(
    { head: changedUsers, data: changedUsers },
    { sCode: 200, errCode: 404, errMessage: 'userNotFound' },
    res,
    next
  );
});

exports.getMySetup = catchAsync(async (req, res, next) => {
  const usrSetUp = await userModel.selectMySetUp(req.user.id);
  responseHandler.respond(
    { head: usrSetUp, data: usrSetUp },
    { sCode: 200, errCode: 404, errMessage: 'userNotFound' },
    res,
    next
  );
});

exports.getUserSetup = catchAsync(async (req, res, next) => {
  const usrSetUp = await userModel.selectUserSetUp(req.user.id, req.params.id);
  responseHandler.respond(
    { head: usrSetUp, data: usrSetUp },
    { sCode: 200, errCode: 404, errMessage: 'userNotFound' },
    res,
    next
  );
});
