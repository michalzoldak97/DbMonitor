const dbPool = require('../db');
const { catchAsync, AppError } = require('../error');

const getConfigJson = async () => {
  const { rows } = await dbPool.singleQuerySync({
    queryText: `SELECT config_json FROM app.tbl_config WHERE config_id = $1`,
    queryParam: [1]
  });
  if (!rows[0]) console.log('not exists');
  console.log(rows[0]);
};

const appConfig = getConfigJson();

exports.appConfig;
