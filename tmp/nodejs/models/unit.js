var Base = require('./base');
var logger = require('../helpers/logger');
var util = require('../helpers/util');
var tr = require('../helpers/task_runner');
var validator = require('../helpers/validator');
var nodeUtil = require('util');
var config = require('../conf/config.json');
var vType = validator.Types;
var db = require('./db');

function Unit() {

  Base.call(this, 'unit');
  var _super = Unit.super_.prototype;

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
    var vResult = validator
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
        {name: 'description', type: vType.STRING},
        {name: 'decimalPlaces', rule: validator.Rules.POSITIVE}
      ]).exec();

    if (vResult.error) {
      return callback(vResult.error);
    } else if (kind != 'update') {
      return callback(null, vResult.data);
    }

    that.findById(vResult.data.id, 'id').exec(function(err, result) {
      if (result.length == 0) {
        callback('Unit not found');
      } else {
        callback(err, vResult.data);
      }
    }, callback);

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
        callback('Unit not found');
      } else {
        callback(null, result);
      }
    }.bind(this));

  };

}

nodeUtil.inherits(Unit, Base);
module.exports = Unit;
//
//var db = require('./db');
//
//var data = {
//  "name": "Food Expenses2" + Math.floor(Math.random() * 1000)
//};
//
//var unit = new Unit();
//unit.find().exec(function(err, result) {
//
//});