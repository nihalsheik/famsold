/**
 * Created by admin on 11-08-2015.
 */

var logger = require('../helpers/logger');
var ApiError = require('../helpers/api_error');
var LedgerGroup = require('../models/ledger_group');

exports.create = function(req, res, next) {
  LedgerGroup.instance().insert(req.body, res.done);
};

exports.update = function(req, res, next) {
  req.body.id = req.params.gid;
  LedgerGroup.instance().updateById(req.body, res.done);
};

exports.getOne = function(req, res, next) {
  LedgerGroup.instance().findOne().where('id=?', [req.params.gid]).exec(res.done);
};

exports.getList = function(req, res, next) {
  LedgerGroup.instance().find().page(req.query.page, req.query.pageSize).exec(res.done);
};

exports.getTree = function(req, res, next) {
  LedgerGroup.instance().getTree(res.done);
};

exports.delete = function(req, res, next) {
  LedgerGroup.instance().deleteById(req.params.gid, res.done);
};
