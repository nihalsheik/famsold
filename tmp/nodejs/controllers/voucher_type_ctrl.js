/**
 * Created by sheik on 22-01-2016.
 */

var VoucherType = require('../models/voucher_type');

exports.create = function(req, res) {
  VoucherType.instance().insert(req.body, res.done);
};

exports.update = function(req, res) {
  req.body.id = req.params.vtid;
  VoucherType.instance().updateById(req.body, res.done);
};

exports.getList = function(req, res) {
  VoucherType.instance().find().page(req.query.page, req.query.pageSize).exec(res.done);
};

exports.getOne = function(req, res) {
  VoucherType.instance().findOne().where('id=?', [req.params.vtid]).exec(res.done);
};

exports.delete = function(req, res) {
  VoucherType.instance().deleteById(req.params.vtid, res.done);
};
