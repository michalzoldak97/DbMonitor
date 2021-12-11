'use strict';
const dbPool = require('../db');
const pgFormat = require('pg-format');
const bcrypt = require('bcrypt');

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
  const encryptedPass = await bcrypt.hash(req.body.password, 12);
  const queryText = `INSERT INTO usr.tbl_user(email, password, created_by_user_id)
                     VALUES ($1, $2, $3)`;
  const queryParam = [req.body.email, encryptedPass, req.body.creatingUserId];
  return await dbPool.singleQuery(queryText, queryParam);
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
  const { rowCount } = await dbPool.singleQuery(queryText, queryParam);
  return rowCount;
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
  return await dbPool.singleQuery(queryText, [id]);
};

exports.selectMySetUp = async id => {
  const queryText = 'SELECT * FROM app.sp_user_settings($1)';
  const { rows } = await dbPool.singleQuery(queryText, [id]);
  return rows;
};

exports.selectUserSetUp = async (myId, usrId) => {
  const queryText = `SELECT a.* FROM app.sp_user_settings($1) a 
                     INNER JOIN app.sp_user_settings($2) b ON a.user_setting = b.user_setting`;
  const { rows } = await dbPool.singleQuery(queryText, [myId, usrId]);
  return rows;
};
