const fs = require('fs');
const tunnel = require('tunnel-ssh');
const { Pool } = require('pg');
const catchAsync = require('./../utils/catchAsync');

module.exports = {
  singleQuery: catchAsync(async (text, params) => {
    const config = {
      host: process.env.SSH_HOST,
      username: process.env.SSH_USERNAME,
      dstHost: process.env.PGHOST,
      dstPort: process.env.PGPORT,
      privateKey: fs.readFileSync(`${process.env.SSH_PRIV_KEY}`),
      passphrase: process.env.SSH_PASSPHRASE
    };
    const tnl = await tunnel(config, async (err, server) => {
      if (err) {
        console.log(`Error: ${err}`);
      }
    });
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });
    const client = await pool.connect();
    const result = {
      query1: await client.query(text, params),
      query2: await client.query(text, params)
    };
    client.release();
    tnl.close();

    return result;
  })
};
