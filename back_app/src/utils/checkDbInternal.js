const dbPool = require('../db');
const { catchAsync, AppError } = require('../error');

exports.checkDbInternal = catchAsync(async (req, res, next) => {
  req.queryText = `SELECT * FROM app.tbl_query WHERE query_id = $1`;
  req.queryParam = [1];
  const queryRes = await dbPool.singleQuery(req, res, next);
  if (!queryRes) return next(new AppError('Internal db check fail', 500));
  const result = {
    rows: queryRes.rowCount,
    duration: queryRes.duration
  };
  return result;
});
