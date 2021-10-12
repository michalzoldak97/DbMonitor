const AppError = require('./appError');

const handleJwtExpired = () =>
  new AppError('Your token has expired! Please log in again.', 401);

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
      message: 'Sth went wong'
    });
  }
};

const handleProdError = (err, req, res) => {
  if (err.name === 'TokenExpiredError') err = handleJwtExpired();
  sendErrorProd(err, res);
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode ??= 500;
  err.status ??= 'Error';
  process.env.NODE_ENV === 'developement'
    ? sendErrorDev(err, res)
    : handleProdError(err, req, res);
};
