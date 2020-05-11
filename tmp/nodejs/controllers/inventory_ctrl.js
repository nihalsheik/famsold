/**
 * Created by sheik on 22-01-2016.
 */

var ModelFactory = require('../helpers/model_factory');

exports.create = function(req, res) {
  ModelFactory.getInventory().insert(req.body, res.done);
};

exports.update = function(req, res) {
  req.body.id = req.params.iid;
  ModelFactory.getInventory().updateById(req.body, res.done);
};

exports.getList = function(req, res) {
  ModelFactory.getInventory().find().page(req.query.page, req.query.pageSize).exec(res.done);
};

exports.getOne = function(req, res) {
  ModelFactory.getInventory().findOne().where('id=?', [req.params.iid]).exec(res.done);
};

exports.delete = function(req, res) {
  ModelFactory.getInventory().deleteById(req.params.iid, res.done);
};
