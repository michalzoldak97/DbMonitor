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
      ,e.pg_port
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
  INSERT INTO app.tbl_environment (environment_ssh_host, environment_ssh_username, environment_ssh_priv_key, environment_ssh_passphrase, pg_host, pg_port, pg_database, pg_username, pg_password, created_by_user_id)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
  const queryParams = [
    req.body.env_ssh_host,
    req.body.env_ssh_username,
    req.body.env_ssh_priv_key,
    req.body.env_ssh_pass,
    req.body.pg_host,
    req.body.pg_port,
    req.body.pg_db,
    req.body.pg_username,
    req.body.pg_pass,
    req.user.id
  ];
  const { rowCount } = await dbPool.singleQuery(queryText, queryParams);
  if (!rowCount) return rowCount;
  return {
    created: rowCount,
    newEnv: {
      env_ssh_host: req.body.env_ssh_host,
      env_ssh_username: req.body.env_ssh_username,
      env_ssh_priv_key: req.body.env_ssh_priv_key,
      env_ssh_pass: req.body.env_ssh_pass,
      pg_host: req.body.pg_host,
      pg_port: req.body.pg_port,
      pg_db: req.body.pg_db,
      pg_username: req.body.pg_username,
      pg_pass: req.body.pg_pass
    }
  };
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
    ,pg_port = $6
    ,pg_database = $7
    ,pg_username = $8
    ,pg_password = $9
    ,last_updated_by_user_id = $10
  WHERE
    e.environment_id = $11`;
  const queryParams = [
    req.body.env_ssh_host,
    req.body.env_ssh_username,
    req.body.env_ssh_priv_key,
    req.body.env_ssh_pass,
    req.body.pg_host,
    req.body.pg_port,
    req.body.pg_db,
    req.body.pg_username,
    req.body.pg_pass,
    req.user.id,
    req.params.id
  ];
  const { rowCount } = await dbPool.singleQuery(queryText, queryParams);
  return rowCount;
};

exports.deactivateEnv = async (env_id, usr_id) => {
  const queryText = `
  SELECT * FROM app.tf_environment_deactivate($1, $2)
  `;
  const queryParams = [env_id, usr_id];
  const { rows } = await dbPool.singleQuery(queryText, queryParams);
  return rows;
};

exports.assignEnvs = async req => {
  const queryText = `
  SELECT * FROM usr.tf_user_environment_assign($1, $2, $3)`;
  const { rowCount } = await dbPool.singleQuery(queryText, [
    req.user.id,
    req.body.user_id,
    req.body.environments
  ]);
  return rowCount;
};

exports.unassignEnvs = async req => {
  const queryText = pgFormat(
    `
  DELETE FROM usr.tbl_user_environment ue
  WHERE 
    ue.user_id = $1
    AND ue.environment_id IN (%L)
    AND ue.environment_id IN (
                              SELECT 
                                  ue.environment_id 
                              FROM usr.tbl_user_environment ue
                              WHERE 
                                  ue.user_id = $2
  )`,
    Array.from(req.body.environments)
      .filter(Number)
      .map(num => parseInt(num, 10))
  );
  const { rowCount } = await dbPool.singleQuery(queryText, [
    req.body.user_id,
    req.user.id
  ]);
  return rowCount;
};
