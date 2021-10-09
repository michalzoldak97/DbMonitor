const { catchAsync, AppError } = require('../error');
const userModel = require('./userModel');

const getAppConfig = async () => {
  const { appConfig } = await require('../utils/config');
  return appConfig;
};

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
