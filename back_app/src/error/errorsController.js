const AppError = require('./appError');

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

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode ??= 500;
  err.status ??= 'Error';
  process.env.NODE_ENV === 'developement'
    ? sendErrorDev(err, res)
    : sendErrorProd(err, res);
};
