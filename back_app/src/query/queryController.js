'use strict';
const queryModel = require('./queryModel');
const { catchAsync } = require('../error');
const { responseHandler } = require('../utils');

exports.getQuery = catchAsync(async (req, res, next) => {
  const getConfig = {
    condition: 'AND q.query_id',
    q_id: req.params.id,
    usr_id: req.user.id
  };
  const query = await queryModel.selectQuery(getConfig);
  responseHandler.respond(
    { head: query[0], data: query },
    { sCode: 200, errCode: 500, errMessage: 'qNotFound' },
    res,
    next
  );
});

exports.getQueryAll = catchAsync(async (req, res, next) => {
  const getConfig = {
    condition: 'AND 1',
    q_id: 1,
    usr_id: req.user.id
  };
  const queries = await queryModel.selectQuery(getConfig);
  responseHandler.respond(
    { head: queries[0], data: queries },
    { sCode: 200, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});

exports.createQuery = catchAsync(async (req, res, next) => {
  const newQuery = await queryModel.insertQuery(req);
  responseHandler.respond(
    { head: newQuery, data: newQuery },
    { sCode: 201, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});

exports.modifyQuery = catchAsync(async (req, res, next) => {
  const updatedEnv = await queryModel.updateEnv(req);
  responseHandler.respond(
    { head: updatedEnv, data: updatedEnv },
    { sCode: 200, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});

exports.deleteEnv = catchAsync(async (req, res, next) => {
  const deletedEnv = await queryModel.deactivateEnv(req.params.id, req.user.id);
  responseHandler.respondEmpty(
    { head: deletedEnv },
    { sCode: 204, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});

exports.assignEnvs = catchAsync(async (req, res, next) => {
  const assignedEnvs = await queryModel.assignEnvs(req);
  responseHandler.respond(
    { head: assignedEnvs, data: assignedEnvs },
    { sCode: 200, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});

exports.unassignEnvs = catchAsync(async (req, res, next) => {
  const unassignedEnvs = await queryModel.unassignEnvs(req);
  responseHandler.respond(
    { head: unassignedEnvs, data: unassignedEnvs },
    { sCode: 200, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});
