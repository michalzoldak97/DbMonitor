'use strict';
const dbPool = require('../db');
const { catchAsync, AppError } = require('../error');

exports.checkDbInternal = catchAsync(async (req, res, next) => {
  const queryText = `SELECT * FROM app.tbl_query WHERE query_id = $1`;
  const queryParam = [1];
  const queryRes = await dbPool.singleQuery(queryText, queryParam);
  if (!queryRes) return next(new AppError('Internal db check fail', 500));
  const result = {
    rows: queryRes.rowCount,
    duration: queryRes.duration
  };
  return result;
});
