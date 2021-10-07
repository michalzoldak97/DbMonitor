const fs = require('fs');
const tunnel = require('tunnel-ssh');
const { Pool } = require('pg');
const { catchAsync, AppError } = require('../error');

exports.singleQuery = catchAsync(async (req, res, next) => {
  const config = {
    host: process.env.SSH_HOST,
    username: process.env.SSH_USERNAME,
    dstHost: process.env.PGHOST,
    dstPort: process.env.PGPORT,
    privateKey: fs.readFileSync(`${process.env.SSH_PRIV_KEY}`),
    passphrase: process.env.SSH_PASSPHRASE
  };
  const tnl = tunnel(config, (err, server) => {
    if (err) return next(new AppError(`Tunnel set up failure`, 500));
  });
  const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
  });
  const client = await pool.connect();
  if (!client) return next(new AppError(`Database connection fail`, 500));
  console.log(`Text= ${req.queryText}`);
  const result = await client.query(req.queryText, req.queryParam);

  client.release();
  tnl.close();

  return result;
});
