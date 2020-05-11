/**
 * Created by admin on 11-08-2015.
 */

var db = require('../models/db');
var voucher = require('../models/voucher');

exports.create = function(req, res, next) {
  new voucher(req.db).insertOrUpdate(req.body, res.done);
};

exports.update = function(req, res, next) {
  req.body.id = req.params.vid;
  voucher.update(req.body, res.done);
};

exports.findOne = function(req, res, next) {
  new voucher(req.db).findOne(req.params.vid, res.done);
};

exports.deleteVoucher = function(req, res, next) {

};

exports.getVoucherTypes = function(req, res, next) {
  req.db.query('SELECT id,name,shortName FROM voucher_type', res.done);
};
