'use strict';
const interDbPool = require('../db');
const tunnel = require('tunnel-ssh');
const fs = require('fs');
const { AppError } = require('../error');

const createTunnel = env => {
  const config = {
    host: env.pg_host,
    username: env.environment_ssh_username,
    dstHost: env.pg_host,
    dstPort: env.pg_port,
    privateKey: fs.readFileSync(`${env.environment_ssh_priv_key}`),
    passphrase: env.environment_ssh_passphrase
  };
  const tnl = tunnel(config, (err, server) => {
    if (err) return new AppError(`Tunnel set up failure`, 500);
  });
  return tnl;
};

exports.runQuery = async (u_id, env_id, q_id) => {
  const queryText = `
    SELECT * FROM app.sp_environment_query($1, $2, $3)
    `;
  const { rows } = await interDbPool.singleQuery(queryText, [
    u_id,
    env_id,
    q_id
  ]);
  const tunnel = createTunnel(rows[0].sp_environment_query[0].environment);
  tunnel.close();
  return rows[0].sp_environment_query[0];
};
