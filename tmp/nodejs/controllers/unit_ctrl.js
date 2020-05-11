/**
 * Created by sheik on 22-01-2016.
 */

var ModelFactory = require('../helpers/model_factory');

exports.create = function(req, res) {
  ModelFactory.getUnit().insert(req.body, res.done);
};

exports.update = function(req, res) {
  req.body.id = req.params.uid;
  ModelFactory.getUnit().updateById(req.body, res.done);
};

exports.getList = function(req, res) {
  ModelFactory.getUnit().find().page(req.query.page, req.query.pageSize).exec(res.done);
};

exports.getOne = function(req, res) {
  ModelFactory.getUnit().findOne().where('id=?', [req.params.uid]).exec(res.done);
};

exports.delete = function(req, res) {
  ModelFactory.getUnit().deleteById(req.params.uid, res.done);
};
