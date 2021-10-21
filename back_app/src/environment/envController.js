'use strict';
const envModel = require('./envModel');
const { catchAsync } = require('../error');
const { responseHandler } = require('../utils');

exports.getEnvironment = catchAsync(async (req, res, next) => {
  const getConfig = {
    condition: 'AND e.environment_id',
    env_id: req.params.id,
    usr_id: req.user.id
  };
  const env = await envModel.selectEnv(getConfig);
  responseHandler.respond(
    { head: env[0], data: env },
    { sCode: 200, errCode: 500, errMessage: 'envOperationFail' },
    res,
    next
  );
});

exports.getEnvironmentAll = catchAsync(async (req, res, next) => {
  const getConfig = {
    condition: 'AND 1',
    env_id: 1,
    usr_id: req.user.id
  };
  const envs = await envModel.selectEnv(getConfig);
  responseHandler.respond(
    { head: envs[0], data: envs },
    { sCode: 200, errCode: 500, errMessage: 'envOperationFail' },
    res,
    next
  );
});

exports.createEnvironment = catchAsync(async (req, res, next) => {
  const newEnv = await envModel.insertEnv(req);
  responseHandler.respond(
    { head: newEnv, data: newEnv },
    { sCode: 201, errCode: 500, errMessage: 'envOperationFail' },
    res,
    next
  );
});

exports.modifyEnvironment = catchAsync(async (req, res, next) => {
  const updatedEnv = await envModel.updateEnv(req);
  responseHandler.respond(
    { head: updatedEnv, data: updatedEnv },
    { sCode: 200, errCode: 500, errMessage: 'envOperationFail' },
    res,
    next
  );
});

exports.assignEnvs = catchAsync(async (req, res, next) => {
  const assignedEnvs = await envModel.assignEnvs(req);
  responseHandler.respond(
    { head: assignedEnvs, data: assignedEnvs },
    { sCode: 200, errCode: 500, errMessage: 'envOperationFail' },
    res,
    next
  );
});

exports.unassignEnvs = catchAsync(async (req, res, next) => {
  const unassignedEnvs = await envModel.unassignEnvs(req);
  responseHandler.respond(
    { head: unassignedEnvs, data: unassignedEnvs },
    { sCode: 200, errCode: 500, errMessage: 'envOperationFail' },
    res,
    next
  );
});
