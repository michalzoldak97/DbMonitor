const jwt = require('jsonwebtoken');
const { catchAsync, AppError } = require('../error');
const { use } = require('../routes/processRoutes');
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
