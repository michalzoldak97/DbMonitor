const { Pool } = require('pg');
const { catchAsync, AppError } = require('../error');

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBNAME,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT
});

exports.singleQuery = catchAsync(async (req, res, next) => {
  const start = Date.now();
  const queryRes = await pool.query(req.queryText, req.queryParam);
  if (!queryRes) return next(new AppError('Internal db query fail', 500));
  queryRes.duration = Date.now() - start;
  return queryRes;
});
