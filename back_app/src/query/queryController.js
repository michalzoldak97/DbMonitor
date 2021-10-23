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
  const updatedQuery = await queryModel.updateQuery(req);
  responseHandler.respond(
    { head: updatedQuery, data: updatedQuery },
    { sCode: 200, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});

exports.deleteQuery = catchAsync(async (req, res, next) => {
  const deletedQuery = await queryModel.deactivateQuery(
    req.params.id,
    req.user.id
  );
  responseHandler.respondEmpty(
    { head: deletedQuery },
    { sCode: 204, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});

exports.assignQueries = catchAsync(async (req, res, next) => {
  const assignedQueries = await queryModel.assignQueries(req);
  responseHandler.respond(
    { head: assignedQueries, data: assignedQueries },
    { sCode: 200, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});

exports.unassignQueries = catchAsync(async (req, res, next) => {
  const unassignedQueries = await queryModel.unassignQueries(req);
  responseHandler.respond(
    { head: unassignedQueries, data: unassignedQueries },
    { sCode: 200, errCode: 500, errMessage: 'qOperationFail' },
    res,
    next
  );
});
