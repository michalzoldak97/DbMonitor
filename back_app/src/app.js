const express = require('express');

const AppError = require('./utils/appError');
const processRouter = require('./routes/processRoutes');

const app = express();

app.use(express.json());
app.use('/api/v1/process', processRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not foundd`, 404));
});

module.exports = app;
