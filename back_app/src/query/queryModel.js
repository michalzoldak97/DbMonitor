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

exports.updateQuery = async req => {
  const queryText = `
  UPDATE app.tbl_query q
  SET 
    query_name = $1
    ,query_description = $2
    ,query_text = $3
    ,last_updated_by_user_id = $4
  WHERE
    q.query_id = $5`;
  const queryParams = [
    req.body.query_name,
    req.body.query_description,
    req.body.query_text,
    req.user.id,
    req.params.id
  ];
  const { rowCount } = await dbPool.singleQuery(queryText, queryParams);
  return rowCount;
};

exports.deactivateQuery = async (q_id, usr_id) => {
  const queryText = `
SELECT * FROM app.tf_query_deactivate($1, $2)
`;
  const queryParams = [q_id, usr_id];
  const { rows } = await dbPool.singleQuery(queryText, queryParams);
  return rows;
};

exports.assignQueries = async req => {
  const queryText = `
  SELECT * FROM usr.tf_user_query_assign($1, $2, $3)`;
  const { rowCount } = await dbPool.singleQuery(queryText, [
    req.user.id,
    req.body.user_id,
    req.body.queries
  ]);
  return rowCount;
};

exports.unassignQueries = async req => {
  const queryText = pgFormat(
    `
  DELETE FROM usr.tbl_user_query uq
  WHERE 
    uq.user_id = $1
    AND uq.query_id IN (%L)
    AND uq.query_id IN (
                              SELECT 
                                uq.query_id 
                              FROM usr.tbl_user_query uq
                              WHERE 
                                uq.user_id = $2
  )`,
    Array.from(req.body.queries)
      .filter(Number)
      .map(num => parseInt(num, 10))
  );
  const { rowCount } = await dbPool.singleQuery(queryText, [
    req.body.user_id,
    req.user.id
  ]);
  return rowCount;
};
