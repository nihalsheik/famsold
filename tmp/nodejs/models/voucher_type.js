var Base = require('./base');
var logger = require('../helpers/logger');
var validator = require('../helpers/validator');
var nodeUtil = require('util');
var vType = validator.Types;
var db = require('./db');

function VoucherType() {

  Base.call(this, 'voucher_type');
  var _super = VoucherType.super_.prototype;

  this.insert = function(data, callback) {
    this.validate('insert', data, function(err, newData) {
      if (err) return callback(err);
      db.insert('voucher_type', newData, callback);
    }.bind(this));
  };

  this.updateById = function(data, callback) {
    this.validate('update', data, function(err, newData) {
      if (err) return callback(err);
      db.update('voucher_type', newData, 'id=?', [newData.id], callback);
    }.bind(this));
  };

  this.validate = function(kind, data, callback) {
    var vRes = validator
      .validate(data)
      .fieldMap([
        {
          name: 'id',
          required: (kind == 'update'),
          type: vType.NUMERIC,
          rule: validator.Rules.POSITIVE
        },
        {
          name: 'name',
          required: true,
          type: vType.STRING,
          rule: validator.Rules.NAME
        },
        {name: 'description', type: vType.STRING}
      ]
    ).exec();

    if (vRes.error) {
      return callback(vRes.error);
    }

    data = vRes.data;

    if (kind == 'update') {
      this.findById(data.id, 'id').exec(function(err, result) {
        if (result.length == 0) {
          callback('Voucher type not found');
        }
        callback(null, data);
      });
    } else {
      callback(null, data);
    }

  };

  /**
   * @param id
   * @param callback
   * @returns {*}
   */
  this.deleteById = function(id, callback) {

    if (!validator.isPositive(id, false)) {
      return callback('Invalid id');
    }
    _super.deleteById.call(this, id, function(err, result) {
      if (err) {
        callback(err);
      } else if (result.affectedRows == 0) {
        callback('Voucher type not found');
      } else {
        callback(null, result);
      }
    }.bind(this));

  };
}

nodeUtil.inherits(VoucherType, Base);

exports.instance = function() {
  return new VoucherType();
};

exports.Types = {
  OPENING_BALANCE: 1,
  CONTRA: 2,
  PAYMENT: 3,
  RECEIPT: 4,
  JOURNAL: 5,
  SALES: 6,
  PURCHASE: 7,
  CREDIT_NOTE: 8,
  DEBIT_NOTE: 9,
  REVERSE_JOURNAL: 10,
  MEMO: 11,
  PURCHASE_ORDER: 12,
  SALES_ORDER: 13,
  RECEIPT_NOTE: 14,
  DELIVERY_NOTE: 15,
  REJECTION_OUT: 16,
  REJECTION_IN: 17,
  STOCK_JOURNAL: 18,
  PHYSICAL_STOCK: 19,
  isValid: function(type) {
    type = parseInt(type || 0);
    return type > 0 && type < 20;
  }
};