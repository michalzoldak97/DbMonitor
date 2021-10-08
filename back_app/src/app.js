const express = require('express');

const { AppError, globalErrorHandler } = require('./error');
const { processRouter, userRouter } = require('./routes');

const app = express();

app.use(express.json());
app.use('/api/v1/process', processRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
