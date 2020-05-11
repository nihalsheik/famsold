/**
 * Created by admin on 11-08-2015.
 */
var logger = require('../helpers/logger');
var ModelFactory = require('../helpers/model_factory');

exports.create = function(req, res, next) {
  ModelFactory.getLedger(req.dbConnection).insert(req.body, res.done);
};

exports.update = function(req, res, next) {
  req.body.id = req.params.lid;
  ModelFactory.getLedger(req.dbConnection).updateById(req.body, res.done);
};

exports.getOne = function(req, res, next) {
  ModelFactory.getLedger(req.dbConnection).findById({id: req.params.lid}, res.done);
};

exports.getList = function(req, res, next) {
  logger.debug('ctrl ledger get');
  ModelFactory.getLedger(req.dbConnection).getList(req.query.groupId, function(err, result) {
    if (err) res.error(err); else res.ok(result);
  });
};

exports.delete = function(req, res, next) {
  ModelFactory.getLedger(req.dbConnection).delete(req.params.lid, res.done);
};
