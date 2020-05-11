var Base = require('./base');
var logger = require('../helpers/logger');
var util = require('../helpers/util');
var tr = require('../helpers/task_runner');
var Voucher = require('./voucher');
var nodeUtil = require('util');
var validator = require('../helpers/validator');
var vType = validator.Types;
var ApiError = require('../helpers/api_error');
var VoucherType = require('./voucher_type');
var db = require('./db');

function Ledger() {

  Base.call(this, 'ledger');

  var _super = Ledger.super_.prototype;

  this.insert = function(data, callback) {
    _insertOrUpdate.call(this, data, true, callback);
  }

  this.updateById = function(data, callback) {
    _insertOrUpdate.call(this, data, false, callback);
  }

  function _insertOrUpdate(reqData, isNew, callback) {

    var data, voucherItems, voucherId, con;

    tr.series()
      .context(this)
      .then(_validate)
      .then(_saveLedger)
      .then(_updateOB)
      .onError(_error)
      .exec(_done);

    function _validate(cb) {

      this.validate(isNew ? 'insert' : 'update', reqData, function(err, newData, vi) {

        if (err) {
          return cb.error(err);
        }

        data = newData
        voucherItems = vi;

        logger.debug(JSON.stringify(data, null, 2));
        logger.debug(JSON.stringify(voucherItems, null, 2));
        return;

        //logger.debug('_beginTrans');
        //db.getConnection(function(err, con) {
        //  if (err) return cb.error(err);
        //  db.beginTransaction(con, cb.next, cb.error);
        //})

      });
    }

    function _saveLedger(cb, err, connection) {
      if (err) return cb.error(err);
      logger.debug('save');
      logger.debug(JSON.stringify(data, null, 2));
      con = connection;
      if (isNew) {
        _super.insert.call(this, data, con, cb.next, cb.error);
      } else {
        _super.updateById.call(this, data, con, cb.next, cb.error);
      }
    }

    function _updateOB(cb, err, result) {

      logger.debug('upadteOB, voucherId: ', data.voucherId);

      var hasOB = data.debit > 0 || data.credit > 0;
      var ledgerId = isNew ? result.insertId : data.id;

      var vData = {
        ref: 'Opening Balance',
        type: VoucherType.Types.OPENING_BALANCE,
        narration: 'For Opening Balance',
        ledgers: [
          {id: 0, ledgerId: ledgerId, debit: data.debit, credit: data.credit, narration: 'OB'},
          {id: 0, ledgerId: ledgerId, debit: data.debit, credit: data.credit, narration: 'OB'}
        ]
      }

      if (isNew) {
        var voucher = new Voucher();
        voucher.insert(data, cb.next);
      } else {
        vData.id = 100 //@Fixme voucher should
      }

    }

    function _error(err) {
      logger.debug('Error :', err);
      if (err) {
        //return db.rollback(con, function() {
        //  callback(err);
        //});
      }
    };

    function _done() {
      logger.debug('done');
      //Commit;
      //db.commit(con, function() {
      //  callback(null, ledger);
      //});
    }

  }

  this.validate = function(kind, reqData, callback) {

    logger.debug('validate');

    var that = this;
    var vRes = validator
      .validate(reqData)
      .fieldMap([
        {
          name: 'id',
          required: (kind == 'update'),
          type: vType.NUMERIC,
          rule: validator.Rules.POSITIVE
        },
        {
          name: 'groupId',
          required: (kind == 'insert'),
          type: vType.NUMERIC,
          min: 5,
        },
        {
          name: 'name',
          required: true,
          type: vType.STRING,
          rule: validator.Rules.NAME
        },
        {
          name: 'debit',
          type: vType.NUMERIC,
          defaultValue: 0
        },
        {
          name: 'credit',
          type: vType.NUMERIC,
          defaultValue: 0
        }
      ]).exec();

    if (vRes.error) {
      return callback(vRes.error);
    }

    if (data.debit > 0 && data.credit > 0) {
      return callback('Invalid opening balance, either it should be debit or credit');
    }
    logger.debug('validated');

    data = vRes.data;
    vItems = null;

    tr.series().context(this)

      //------------------------------------------------//

      .then(function(cb) {
        this.findById(data.groupId).from('ledger_group').exec(function(err, result) {
          if (result.length == 0) {
            return cb.error('Invalid group Id');
          } else {
            data.groupNature = result[0].nature;
            data.groupType = result[0].type;
            cb.next();
          }
        }, cb.error);

      }, data.hasOwnProperty('groupId'))

      //------------------------------------------------//

      .then(function(cb) {

        this.findById(data.id, 'id').exec(function(err, result) {
          if (result.length == 0) {
            return cb.error('Ledger not found');
          } else {
            cb.next();
          }
        }, cb.error);

      }, kind == 'update')

      //------------------------------------------------//

      .then(function(cb) {
        this.find('id,voucherId').from('view_voucher').where('(ledgerId=? OR ledgerId=1) AND type=1', [data.id])
          .exec(function(err, result) {
            vItems = result;
            cb.next();
          }.bind(this),
          cb.error
        );

      }, kind == 'update')
      //------------------------------------------------//
      .onError(callback)
      .exec(function() {
        callback(null,data, vItems);
      });

  };

  /**
   *
   * @param ledgerId
   * @param callback
   */
  this.deleteById = function(id, callback) {

    var that = this;
    id = parseInt(id);

    this.findById(id, 'debit,credit').exec(function(err, result) {

      if (result.length == 0) {
        return callback('Not Found');
      }

      var hasOb = (result[0].debit > 0 || result[0].credit > 0);

      this.findOne('id').from('view_voucher').where('ledgerId=? AND type>1', [id]).exec(function(err, result) {

        if (result.length > 0) {
          return callback("Can't delete this ledger, some voucher entries are there");
        }

        var sql = '';

        if (hasOb) {
          sql += 'DELETE FROM voucher WHERE id IN(SELECT voucherId from voucher_item WHERE type=1 AND ledgerId=?);';
        }

        sql += 'DELETE FROM ledger WHERE id=?';

        logger.debug(sql);

        con.query(sql, [id, id]).exec(function(err, result) {
          logger.debug(result);
          callback(null, 'done');
        });

      }.bind(this), callback);

    }.bind(this), callback);
  }

}

nodeUtil.inherits(Ledger, Base);
module.exports = Ledger;

var data = {
  "id": 2,
  "name": "Food Expenses2" + Math.floor(Math.random() * 1000),
  "groupId": 1001,
  "debit": 2500,
  "credit": 0
};

var ledger = new Ledger();
ledger.updateById(data, function(err, res) {
  logger.debug('-----------------------------');
  logger.debug(err);
  logger.debug(res);
  logger.debug('-----------------------------');
});

