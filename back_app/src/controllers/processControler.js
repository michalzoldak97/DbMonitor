const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const checkDb = require('./../utils/checkDb');

exports.checkDb = catchAsync(async (req, res, next) => {
  const {
    rows
  } = await checkDb.singleQuery(
    `SELECT * FROM plr.tbl_player WHERE player_id = $1`,
    [1]
  );
  if (!rows) return next(new AppError(`Connection fail`, 404));
  res.status(200).json({
    status: 'success',
    message: 'check db called',
    data: rows
  });
});
