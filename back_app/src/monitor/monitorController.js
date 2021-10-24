'use strict';
const { catchAsync } = require('../error');
const monitorModel = require('./monitorModel');
const { responseHandler } = require('../utils');

exports.runQuery = catchAsync(async (req, res, next) => {
  const result = await monitorModel.runQuery(
    req.user.id,
    req.params.envId,
    req.params.qId
  );
  responseHandler.respond(
    { head: result, data: result },
    { sCode: 200, errCode: 500, errMessage: 'envOperationFail' },
    res,
    next
  );
});
