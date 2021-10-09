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
  else return { id: rows[0].user_id, email: rows[0].email };
};

exports.selectUsers = async config => {
  const queryText = `SELECT * FROM usr.tbl_user
                      WHERE
                          deactivated_datetime IS NULL`;
  const { rows } = await dbPool.singleQuery(queryText, []);
  if (config.scope === 'unrestricted') return rows;
  else
    return rows.map(usr => {
      return { id: usr.user_id, email: usr.email };
    });
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
  const queryText = `INSERT INTO usr.tbl_user(email, password, created_by_user_id)
                     VALUES ($1, $2, $3)`;
  const queryParam = [req.body.email, encryptedPass, req.body.creatingUserId];
  const queryRes = await dbPool.singleQuery(queryText, queryParam);
  return queryRes;
};

exports.updateUser = async config => {
  const queryText = pgFormat(
    `UPDATE usr.tbl_user
     SET %I = $1
     WHERE %I = $2`,
    config.toChange,
    config.id
  );
  const queryParam = [config.val, config.condition];
  const queryRes = await dbPool.singleQuery(queryText, queryParam);
  return queryRes;
};

exports.selectUserPermissions = async id => {
  const queryText = `SELECT DISTINCT
                        up.permission_id
                     FROM usr.tbl_permission p
                     INNER JOIN usr.tbl_user_permission up          ON p.permission_id = up.permission_id
                     INNER JOIN usr.tbl_user u                      ON up.user_id = u.user_id
                     WHERE
                        p.deactivated_datetime IS NULL
                        AND u.deactivated_datetime IS NULL
                        AND up.user_id = $1`;
  const queryRes = await dbPool.singleQuery(queryText, [id]);
  return queryRes;
};

exports.selectUserSetUp = async id => {
  const queryText = '';
};
