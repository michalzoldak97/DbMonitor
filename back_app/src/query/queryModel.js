'use strict';
const dbPool = require('../db');
const pgFormat = require('pg-format');

exports.selectQuery = async qConf => {
  const queryText = pgFormat(
    `SELECT 
      q.query_id
      ,q.query_name
      ,q.query_description
      ,q.query_text
    FROM app.tbl_query q
    INNER JOIN usr.tbl_user_query uq                 ON q.query_id = uq.query_id
    WHERE
      q.deactivated_datetime IS NULL
      AND uq.user_id = $1
      %s = $2
      `,
    qConf.condition
  );
  const { rows } = await dbPool.singleQuery(queryText, [
    qConf.usr_id,
    qConf.q_id
  ]);
  return rows;
};

exports.insertQuery = async req => {
  const queryText = `
    INSERT INTO app.tbl_query (query_name, query_description, query_text, created_by_user_id)
    VALUES
      ($1, $2, $3, $4)`;
  const queryParams = [
    req.body.query_name,
    req.body.query_description,
    req.body.query_text,
    req.user.id
  ];
  const { rowCount } = await dbPool.singleQuery(queryText, queryParams);
  if (!rowCount) return rowCount;
  return {
    created: rowCount,
    newQuery: {
      query_name: req.body.query_name,
      query_description: req.body.query_description,
      query_text: req.body.query_text
    }
  };
};
