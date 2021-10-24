'use strict';
const processRouter = require('./processRoutes');
const userRouter = require('./userRoutes');
const environmentRouter = require('./environmentRoutes');
const queryRouter = require('./queryRoutes');
const monitorRouter = require('./monitorRoutes');

module.exports = {
  processRouter,
  userRouter,
  environmentRouter,
  queryRouter,
  monitorRouter
};
