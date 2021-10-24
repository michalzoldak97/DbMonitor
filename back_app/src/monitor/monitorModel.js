'use strict';
const interDbPool = require('../db');

exports.runQuery = async (u_id, env_id, q_id) => {
  const queryText = `
    SELECT * FROM app.sp_environment_query($1, $2, $3)
    `;
  const operationParams = await interDbPool.singleQuery(queryText, [
    u_id,
    env_id,
    q_id
  ]);
  return operationParams;
};
