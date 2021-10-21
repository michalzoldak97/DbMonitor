'use strict';
const { AppError } = require('../error');

const getAppConfig = async () => {
  const { appConfig } = await require('../utils/config');
  return appConfig;
};

exports.respond = async (obj, conf, res, next) => {
  const appConfig = await getAppConfig();
  if (!obj.head)
    return next(
      new AppError(`${appConfig.error.messages[conf.errMessage]}`, conf.errCode)
    );
  res.status(conf.sCode).json({
    message: 'success',
    response: {
      data: obj.data
    }
  });
};
