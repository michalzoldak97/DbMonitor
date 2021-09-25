const express = require("express");
const AppError = require("./utils/appError");

const app = express();
app.use(express.json());

app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not foundd`, 404));
});

module.exports = app;
