'use strict';
const { catchAsync, AppError } = require('../error');
const bcrypt = require('bcrypt');
const userModel = require('./userModel');

const getAppConfig = async () => {
  const { appConfig } = await require('../utils/config');
  return appConfig;
};

exports.getUserAll = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const getConfig = {
    scope: 'restricted'
  };
  const users = await userModel.selectUsers(getConfig);
  if (!users)
    return next(new AppError(`${appConfig.error.messages.userNotFound}`, 404));
  res.status(200).json({
    message: 'success',
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const getConfig = {
    id: 'user_id',
    scope: 'restricted',
    val: req.params.id
  };
  const user = await userModel.selectUser(getConfig);
  if (!user)
    return next(new AppError(`${appConfig.error.messages.userNotFound}`, 404));
  res.status(200).json({
    message: 'success',
    data: {
      user
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const newUser = await userModel.insertUser(req);
  if (!newUser || newUser.status === 'error')
    return next(
      new AppError(
        `${
          newUser?.message
            ? newUser?.message
            : appConfig.error.messages.userCreateFail
        }`,
        500
      )
    );
  res.status(201).json({
    status: 'success',
    data: {
      rowsChanged: newUser.rowCount
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const qConfig = {
    id: 'user_id',
    toChange: 'deactivated_datetime',
    val: new Date(Date.now()),
    condition: req.params.id
  };
  const changedUsers = await userModel.updateUser(qConfig);
  if (!changedUsers)
    return next(new AppError(`${appConfig.error.messages.userNotFound}`, 404));
  res.status(200).json({
    message: 'success',
    data: {
      changedUsers
    }
  });
});

exports.modifyPass = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const newPass = await bcrypt.hash(req.body.newPassword, 12);
  const qConfig = {
    id: 'user_id',
    toChange: 'password',
    val: newPass,
    condition: req.body.id
  };
  const changedUsers = await userModel.updateUser(qConfig);
  if (!changedUsers)
    return next(new AppError(`${appConfig.error.messages.userNotFound}`, 404));
  res.status(200).json({
    message: 'success',
    data: {
      changedUsers
    }
  });
});

exports.getMySetup = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const usrSetUp = await userModel.selectMySetUp(req.user.id);
  if (!usrSetUp)
    return next(new AppError(`${appConfig.error.messages.userNotFound}`, 404));
  res.status(200).json({
    message: 'success',
    data: {
      usrSetUp
    }
  });
});

exports.getUserSetup = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const usrSetUp = await userModel.selectUserSetUp(req.user.id, req.params.id);
  if (!usrSetUp)
    return next(new AppError(`${appConfig.error.messages.userNotFound}`, 404));
  res.status(200).json({
    message: 'success',
    data: {
      usrSetUp
    }
  });
});
