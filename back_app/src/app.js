'use strict';
const express = require('express');

const { AppError, globalErrorHandler } = require('./error');
const { processRouter, userRouter, environmentRouter } = require('./routes');
const { validateToken } = require('./auth');

const app = express();

app.use(express.json());

app.use('/api/v1/user', userRouter);

app.use(validateToken);

app.use('/api/v1/environment', environmentRouter);

app.use('/api/v1/process', processRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
