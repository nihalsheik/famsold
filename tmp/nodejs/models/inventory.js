var Base = require('./base');
var logger = require('../helpers/logger');
var util = require('../helpers/util');
var tr = require('../helpers/task_runner');
var validator = require('../helpers/validator');
var nodeUtil = require('util');
var config = require('../conf/config.json');
var vType = validator.Types;
var db = require('./db');

function Inventory() {

  Base.call(this, 'inventory_item');

  var _super = Inventory.super_.prototype;

  this.insert = function(data, callback) {
    this.validate('insert', data, function(err, newData) {
      if (err) return callback(err);
      _super.insert.call(this, newData, callback);
    }.bind(this));
  };

  this.updateById = function(data, callback) {
    this.validate('update', data, function(err, newData) {
      if (err) return callback(err);
      _super.updateById.call(this, newData, callback);
    }.bind(this));
  };

  this.validate = function(kind, data, callback) {

    var that = this;

    var vRes = validator
      .validate(data)
      .fieldMap([
        {
          name: 'id',
          required: (kind == 'update'),
          type: validator.Types.NUMERIC,
          rule: validator.Rules.POSITIVE
        },
        {
          name: 'name',
          required: true,
          type: vType.STRING,
          rule: validator.Rules.NAME
        },
        {
          name: 'unitId',
          type: vType.NUMERIC,
          required: (kind == 'insert')
        },
        {
          name: 'description',
          type: vType.STRING
        }
      ]).exec();

    if (vRes.error) {
      return callback(vRes.error);
    }

    data = vRes.data;

    tr.series().context(that)
      //------------------------------------------------------------//
      .then(function(cb) {

        this.findById(data.unitId, 'id').from('unit').exec(function(err, result) {
          if (result.length == 0) {
            cb.done('Invalid unit Id');
          } else {
            cb.next();
          }
        }, callback);

      }, data.hasOwnProperty('unitId'))

      //------------------------------------------------------------//
      .then(function(cb) {

        this.findById(data.id, 'id').exec(function(err, result) {
          if (result.length == 0) {
            cb.done('Unit not found');
          } else {
            cb.next();
          }
        }, callback);

      }, kind == 'update')

      //------------------------------------------------------------//
      .exec(function(err) {
        if (err) {
          return callback(err);
        } else {
          callback(null, data)
        }
      }
      //------------------------------------------------------------//
    );
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
        callback('Inventory item not found');
      } else {
        callback(null, result);
      }
    });

  };

}

nodeUtil.inherits(Inventory, Base);
module.exports = Inventory;
/*
 var data = {
 "id": 1,
 "name": "Food Expenses2",
 "groupId": 1,
 "debit": 100,
 "credit": 0
 };

 var DB = require('./db');
 var ledger = new Ledger(new DB());
 ledger.insertOrUpdate(data, function(err, res) {
 console.log(err);
 console.log(res);
 });
 */