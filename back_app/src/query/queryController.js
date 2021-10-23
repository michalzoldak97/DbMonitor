'use strict';
const queryModel = require('./queryModel');
const { catchAsync } = require('../error');
const { responseHandler } = require('../utils');

exports.getQuery = catchAsync(async (req, res, next) => {
  const getConfig = {
    condition: 'AND q.query_id',
    q_id: req.params.id,
    usr_id: req.user.id
  };
  const query = await queryModel.selectQuery(getConfig);
  responseHandler.respond(
    { head: query[0], data: query },
    { sCode: 200, errCode: 500, errMessage: 'qNotFound' },
    res,
    next
  );
});
