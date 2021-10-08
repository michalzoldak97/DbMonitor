const { catchAsync, AppError } = require('../error');
const userModel = require('./userModel');

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
