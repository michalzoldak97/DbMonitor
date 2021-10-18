'use strict';
const envModel = require('./envModel');
const { catchAsync, AppError } = require('../error');

const getAppConfig = async () => {
  const { appConfig } = await require('../utils/config');
  return appConfig;
};

exports.getEnvironment = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const getConfig = {
    condition: 'AND e.environment_id',
    env_id: req.params.id,
    usr_id: req.user.id
  };
  const env = await envModel.selectEnv(getConfig);
  if (!env[0])
    return next(
      new AppError(`${appConfig.error.messages.envOperationFail}`, 500)
    );
  res.status(200).json({
    message: 'success',
    data: {
      env
    }
  });
});

exports.getEnvironmentAll = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const getConfig = {
    condition: 'AND 1',
    env_id: 1,
    usr_id: req.user.id
  };
  const envs = await envModel.selectEnv(getConfig);
  if (!envs[0])
    return next(
      new AppError(`${appConfig.error.messages.envOperationFail}`, 500)
    );
  res.status(200).json({
    message: 'success',
    data: {
      envs
    }
  });
});

exports.createEnvironment = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const newEnv = await envModel.insertEnv(req);
  if (!newEnv)
    return next(
      new AppError(`${appConfig.error.messages.envOperationFail}`, 500)
    );
  res.status(201).json({
    message: 'success',
    data: {
      newEnv
    }
  });
});

exports.modifyEnvironment = catchAsync(async (req, res, next) => {
  const appConfig = await getAppConfig();
  const updatedEnv = await envModel.updateEnv(req);
  if (!updatedEnv)
    return next(
      new AppError(`${appConfig.error.messages.envOperationFail}`, 500)
    );
  res.status(201).json({
    message: 'success',
    data: {
      updatedEnv
    }
  });
});

exports.assignEnvs = catchAsync(async (req, res, next) => {
  const assignedEnvs = await envModel.assignEnvs(req);
  if (!assignedEnvs)
    return next(
      new AppError(`${appConfig.error.messages.envOperationFail}`, 500)
    );
  res.status(200).json({
    message: 'success',
    data: {
      assignedEnvs
    }
  });
});
