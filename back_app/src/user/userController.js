const { catchAsync, AppError } = require('../error');
const userModel = require('./userModel');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userModel.selectUser(req, res, next);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({
    message: 'success',
    data: {
      user
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await userModel.insertUser(req, res, next);
  if (!newUser || newUser.status === 'error')
    return next(
      new AppError(
        `${newUser?.message ? newUser?.message : 'Creating user fail'}`,
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
