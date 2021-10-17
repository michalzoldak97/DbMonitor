'use strict';
const dbPool = require('../db');
const pgFormat = require('pg-format');

exports.selectEnv = async qConf => {
  const queryText = pgFormat(
    `SELECT 
      e.environment_id
      ,e.environment_ssh_host
      ,e.environment_ssh_username
      ,e.environment_ssh_priv_key
      ,e.environment_ssh_passphrase
      ,e.pg_host
      ,e.pg_database
      ,e.pg_username
      ,e.pg_password
    FROM app.tbl_environment e
    INNER JOIN usr.tbl_user_environment ue                 ON e.environment_id = ue.environment_id
    WHERE
      e.deactivated_datetime IS NULL
      AND ue.user_id = $1
      %s = $2
      `,
    qConf.condition
  );
  const { rows } = await dbPool.singleQuery(queryText, [
    qConf.usr_id,
    qConf.env_id
  ]);
  return rows;
};

exports.insertEnv = async req => {
  const queryText = `
  INSERT INTO app.tbl_environment (environment_ssh_host, environment_ssh_username, environment_ssh_priv_key, environment_ssh_passphrase, pg_host, pg_database, pg_username, pg_password, created_by_user_id)
  VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
  const queryParams = [
    req.body.env_ssh_host,
    req.body.env_ssh_username,
    req.body.env_ssh_priv_key,
    req.body.env_ssh_pass,
    req.body.pg_host,
    req.body.pg_db,
    req.body.pg_username,
    req.body.pg_pass,
    req.user.id
  ];
  const { rowCount } = await dbPool.singleQuery(queryText, queryParams);
  return rowCount;
};

exports.updateEnv = async req => {
  const queryText = `
  UPDATE app.tbl_environment e
  SET 
    environment_ssh_host = $1
    ,environment_ssh_username = $2
    ,environment_ssh_priv_key = $3
    ,environment_ssh_passphrase = $4
    ,pg_host = $5
    ,pg_database = $6
    ,pg_username = $7
    ,pg_password = $8
    ,last_updated_by_user_id = $9
  WHERE
    e.environment_id = $10`;
  const queryParams = [
    req.body.env_ssh_host,
    req.body.env_ssh_username,
    req.body.env_ssh_priv_key,
    req.body.env_ssh_pass,
    req.body.pg_host,
    req.body.pg_db,
    req.body.pg_username,
    req.body.pg_pass,
    req.user.id,
    req.params.id
  ];
  const { rowCount } = await dbPool.singleQuery(queryText, queryParams);
  return rowCount;
};
