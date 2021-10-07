const { catchAsync, AppError } = require('../error');
const { checkDb } = require('../utils');

exports.checkDatabase = catchAsync(async (req, res, next) => {
  req.queryText = `SELECT * FROM plr.tbl_player WHERE player_id = $1`;
  req.queryParam = [1];
  const { rows } = await checkDb.singleQuery(req, res, next);
  if (!rows) return next(new AppError(`Query fail`, 404));
  res.status(200).json({
    status: 'success',
    message: 'check db called',
    rows
  });
});
