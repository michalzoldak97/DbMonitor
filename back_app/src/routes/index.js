'use strict';
const processRouter = require('./processRoutes');
const userRouter = require('./userRoutes');
const environmentRouter = require('./environmentRoutes');
const queryRouter = require('./queryRoutes');

module.exports = {
  processRouter,
  userRouter,
  environmentRouter,
  queryRouter
};
