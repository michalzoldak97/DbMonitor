const dbPool = require('../db');
const bcrypt = require('bcrypt');
const { catchAsync, AppError } = require('../error');
const { isValidEmail, isValidPasword } = require('../utils');

exports.selectUser = catchAsync(async (req, res, next) => {
  req.queryText = `SELECT * FROM usr.tbl_user
                    WHERE user_id = $1`;
  req.queryParam = [req.params.id];
  const { rows } = await dbPool.singleQuery(req, res, next);
  if (!rows.length) return 0;
  return rows[0].email;
});

exports.insertUser = catchAsync(async (req, res, next) => {
  if (
    !req.body.creatingUserId ||
    !isValidPasword(req.body.password) ||
    !isValidEmail(req.body.email)
  ) {
    return {
      status: 'error',
      message: 'Incorrect user data'
    };
  }
  const encryptedPass = await bcrypt.hash(req.body.password, 12);
  req.queryText = `INSERT INTO usr.tbl_user(email, password, created_by_user_id)
                   VALUES ($1, $2, $3)`;
  req.queryParam = [req.body.email, encryptedPass, req.body.creatingUserId];
  const queryRes = await dbPool.singleQuery(req, res, next);
  return queryRes;
});
