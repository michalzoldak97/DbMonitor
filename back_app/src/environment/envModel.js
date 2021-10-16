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
