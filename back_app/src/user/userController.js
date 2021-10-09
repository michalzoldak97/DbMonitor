const { catchAsync, AppError } = require('../error');
const userModel = require('./userModel');

const getAppConfig = async () => {
  const { appConfig } = await require('../utils/config');
  return appConfig;
};

exports.getUser = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const user = await userModel.selectUser(req, res, next);
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
  const newUser = await userModel.insertUser(req, res, next);
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
