const { Pool } = require('pg');
const catchAsync = require('./../utils/catchAsync');
const pool = new Pool();

module.exports = {
  singleQuery: (text, params) => pool.query(text, params)
};
