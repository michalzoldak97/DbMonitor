'use strict';
const AppError = require('./appError');

const getAppConfig = async () => {
  const { appConfig } = await require('../utils/config');
  return appConfig;
};

const handleJwtExpired = async () => {
  const appConfig = await getAppConfig();
  return new AppError(appConfig.error.messages.userAuthFail, 401);
};
const handleJwtError = async () => {
  const appConfig = await getAppConfig();
  return new AppError(`${appConfig.error.messages.userAuthFail}`, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log(`Error: ${err}`);
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Sorry, something went wrong...'
    });
  }
};

const handleProdError = async (err, req, res) => {
  if (err.name === 'TokenExpiredError') err = await handleJwtExpired();
  else if (err.name === 'JsonWebTokenError') err = await handleJwtError();
  sendErrorProd(err, res);
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode ??= 500;
  err.status ??= 'Error';
  process.env.NODE_ENV === 'developement' //changed
    ? sendErrorDev(err, res)
    : handleProdError(err, req, res);
};
