const dbPool = require('../db');
const pgFormat = require('pg-format');
const bcrypt = require('bcrypt');
const { isValidEmail, isValidPasword } = require('../utils');

exports.isCorrectPassword = async (recievedPass, userPass) => {
  return await bcrypt.compare(recievedPass, userPass);
};

exports.selectUser = async config => {
  const queryText = pgFormat(
    `SELECT * FROM usr.tbl_user
     WHERE %I = $1
     AND deactivated_datetime IS NULL`,
    config.id
  );
  const queryParam = [config.val];
  const { rows } = await dbPool.singleQuery(queryText, queryParam);
  if (!rows.length) return 0;
  if (config.scope === 'unrestricted') return rows[0];
  else return rows[0].email;
};

exports.insertUser = async req => {
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
  queryText = `INSERT INTO usr.tbl_user(email, password, created_by_user_id)
                   VALUES ($1, $2, $3)`;
  queryParam = [req.body.email, encryptedPass, req.body.creatingUserId];
  const queryRes = await dbPool.singleQuery(queryText, queryParam);
  return queryRes;
};
