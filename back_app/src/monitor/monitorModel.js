'use strict';
const interDbPool = require('../db');
const tunnel = require('tunnel-ssh');
const fs = require('fs');
const { AppError } = require('../error');
const { Pool } = require('pg');
const queryParser = require('./queryParser');

const createTunnel = env => {
  const config = {
    host: env.environment_ssh_host,
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

const createDbClient = async env => {
  const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
  });
  return await pool.connect();
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
  const tnl = createTunnel(rows[0].sp_environment_query[0].environment);
  const client = await createDbClient();
  const result = await client.query(
    queryParser.parseQuery(rows[0].sp_environment_query[1].query.query_text),
    []
  );

  client.release();
  tnl.close();

  return result;
};
