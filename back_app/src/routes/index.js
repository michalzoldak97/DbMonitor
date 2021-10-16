'use strict';
const processRouter = require('./processRoutes');
const userRouter = require('./userRoutes');
const environmentRouter = require('./environmentRoutes');

module.exports = {
  processRouter,
  userRouter,
  environmentRouter
};
