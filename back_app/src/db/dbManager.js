'use strict';
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBNAME,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT
});

exports.singleQuery = async (queryText, queryParam) => {
  const start = Date.now();
  const queryRes = await pool.query(queryText, queryParam);
  queryRes.duration = Date.now() - start;
  return queryRes;
};

exports.singleQuerySync = q => {
  const queryRes = pool.query(q.queryText, q.queryParam);
  return queryRes;
};
