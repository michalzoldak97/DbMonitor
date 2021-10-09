const dbPool = require('../db');

module.exports = (async () => {
  const { rows } = await dbPool.singleQuerySync({
    queryText: `SELECT config_json FROM app.tbl_config WHERE config_id = $1`,
    queryParam: [1]
  });
  return { appConfig: rows[0].config_json };
})();
