const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { catchAsync, AppError } = require('../error');
const userModel = require('../user/userModel');

const getAppConfig = async () => {
  const { appConfig } = await require('../utils/config');
  return appConfig;
};

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user.email
    }
  });
};
exports.login = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const { email, password } = req.body;
  if (!email || !password)
    return next(
      new AppError(appConfig.error.messages.userIncompleteLoginData, 400)
    );
  const getConfig = {
    id: 'email',
    scope: 'unrestricted',
    val: email
  };
  const user = await userModel.selectUser(getConfig);
  if (!user || !(await userModel.isCorrectPassword(password, user.password)))
    return next(
      new AppError(appConfig.error.messages.userInvalidCredentials, 401)
    );
  createSendToken(user, 200, res);
});

exports.validateToken = catchAsync(async (req, res, next) => {
  let token;
  const appConfig = await getAppConfig();
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token)
    return next(new AppError(appConfig.error.messages.userAuthFail, 401));
  const decodedJwt = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const activeUser = {
    id: decodedJwt.id,
    permissions: (
      await userModel.selectUserPermissions(decodedJwt.id)
    ).rows.map(row => row.permission_id)
  };
  if (!activeUser.permissions.length)
    return next(new AppError(appConfig.error.messages.userAuthFail, 401));
  req.user = activeUser;
  next();
});

exports.validatePermission = (...perm) => {
  return async (req, res, next) => {
    const {
      user: { permissions }
    } = await getAppConfig();
    perm.forEach(p => {
      if (!req.user.permissions.includes(permissions[p]))
        return next(new AppError('Permission denied', 403));
    });
    next();
  };
};
