/**
 * Created by sheik on 07-12-2015.
 */

var Base = require('./base');
var db = require('./db');
var logger = require('../helpers/logger');
var tr = require('../helpers/task_runner');
var nodeUtil = require('util');
var util = require('../helpers/util');
var validator = require('../helpers/validator');
var ApiError = require('../helpers/api_error');
var VoucherType = require('./voucher_type');
var LedgerGroup = require('./ledger_group');
var msg = require('../conf/message');

function Voucher() {

  Base.call(this, 'voucher');
  var _super = Voucher.super_.prototype;

  this.insert = function(data, opt, callback) {
    logger.debug('insert');
    if (opt instanceof Function) {
      callback = opt;
    }
    _insertOrUpdate.call(this, 'insert', data, opt, callback);
  };

  this.update = function(data, opt, callback) {
    logger.debug('update');
    if (opt instanceof Function) {
      callback = opt;
    }
    _insertOrUpdate.call(this, 'update', data, opt, callback);
  };

  /**
   * @param kind
   * @param data
   * @param opt
   * @param callback
   * @returns {*}
   */
  this.validate = function(kind, data, opt, callback) {
    logger.debug('Validate');

    data = data || {};

    var debit = 0
      , credit = 0
      , uniqueLids = []
      , rulePositive = validator.Rules.POSITIVE;

    if (kind == 'insert') {
      delete data.id;
    } else if (kind == 'update') {
      data.id = parseInt(data.id || 0);
      if (data.id < 1) {
        return callback('Invalid voucher id');
      }
    }

    if (!VoucherType.Types.isValid(data.type)) {
      return callback('Invalid voucher type');
    }

    data.ref = data.ref || '';
    data.narration = data.narration || '';

    var ledgers = data.ledgers || [];

    logger.debug('Ledger length : ', ledgers.length);

    if (ledgers.length < 2) {
      return callback('Invalid voucher entry. It should be at least two.')
    }
    // 1. Find invalid ledgerIds
    // 2. Find voucherId
    // 3. Debit and credit should be equal
    // 4. Find duplicate ledger id for other than journals
    // 5. If new then data.id should be empty
    // 6. Against ledger update.
    // 7. Debit & credit should not be value

    logger.debug('Iterating ledgers...');
    var invalidLedger = null;

    var ledgerLen = ledgers.length, err = '', uniqueVids = {};

    for (var i = 0; i < ledgerLen; i++) {
      var ledger = ledgers[i];
      logger.debug('Validating ledger: ', ledger);

      if (!rulePositive.test(ledger.id)) {
        err = 'Invalid voucher item id';

      } else if (!rulePositive.test(ledger.ledgerId)) {
        err = 'Invalid ledger id';

      } else if (!rulePositive.test(ledger.debit)) {
        err = 'Invalid debit amount';

      } else if (!rulePositive.test(ledger.credit)) {
        err = 'Invalid credit amount';

      } else if (ledger.debit > 0 && ledger.credit > 0) {
        err = "Debit & Credit should not be value";

      } else if (ledger.debit == 0 && ledger.credit == 0) {
        err = "Empty debit and credit";

      } else if (uniqueVids.hasOwnProperty(ledger.id)) {
        err = 'Duplicate voucher item id';

      }

      if (err != '') {
        ledger.message = err;
        invalidLedger = ledger;
        break;
      }

      ledger.id = parseInt(ledger.id);
      ledger.ledgerId = parseInt(ledger.ledgerId);
      ledger.debit = parseInt(ledger.debit);
      ledger.credit = parseInt(ledger.credit);

      if (uniqueLids.indexOf(ledger.ledgerId) == -1) {
        uniqueLids.push(ledger.ledgerId);
      }

      if (ledger.id > 0) {
        uniqueVids[ledger.id] = 0;
      }

      debit += ledger.debit;
      credit += ledger.credit;
    }

    if (invalidLedger != null) {
      var e = new ApiError();
      e.message = 'Invalid data';
      e.fields = invalidLedger;
      return callback(e);

    } else if (uniqueLids.length < 2) {
      return callback('It should be two entry. Some ledger ids are unique.');

    } else if (debit != credit) {
      /**
       * type=1 opening balance does not need to have balanced one.
       */
      return callback('Unbalanced Voucher')
    }
    //cleanup;
    uniqueVids = null;

    logger.debug('Ledgers', JSON.stringify(ledgers, null, 2));

    var optData = null;

    tr.series()
      .context(this)
      .then(_validateLedger)
      .then(_validateVoucher, kind == 'update')
      .then(_updateAgainstLedger)
      .onError(callback)
      .exec(function() {
        callback(null, {data: data, optData: optData});
      });

    //------------------------------------------------------//
    // Validating voucher id.
    //------------------------------------------------------//
    function _validateLedger(cb) {
      logger.debug('Validating Unique Ledger Ids');
      this.find('id,groupType').where('id IN (?)', [uniqueLids]).from('ledger').exec(function(err, result) {

        var leds = util.queryArray(result);

        var v = [];
        uniqueLids.forEach(function(uid) {
          if (!leds.has(uid)) {
            v.push(uid);
          }
        });
        //cleanup
        uniqueLids = null;

        logger.debug('Invalid ledger, length ', v.length);

        if (v.length > 0) {
          return cb.error('Invalid ledgers found [' + v.join(',') + ']');
        } else if (data.type == VoucherType.Types.JOURNAL) {
          return cb.next();
        }

        var dLedger = (ledgers[0].debit > 0) ? 0 : 1,
          cLedger = 1 - dLedger;

        // err variable already declared part of above function.
        err = null;

        dLedger = leds.get(ledgers[dLedger].ledgerId);
        cLedger = leds.get(ledgers[cLedger].ledgerId);

        logger.debug('Ledger id validation');
        logger.debug(JSON.stringify(leds, null, 2));

        switch (data.type) {
          case VoucherType.Types.CONTRA:
            logger.debug('Type: Contra');
            if (!LedgerGroup.Types.isCashOrBank(dLedger.groupType) || !LedgerGroup.Types.isCashOrBank(cLedger.groupType)) {
              err = msg.get(3002);
            }
            break;

          case VoucherType.Types.PAYMENT:
            logger.debug('Type: PAYMENT');

            if (LedgerGroup.Types.isCashOrBank(dLedger.groupType)) {
              err = msg.get(3001);
            } else if (!LedgerGroup.Types.isCashOrBank(cLedger.groupType)) {
              err = msg.get(3002);
            }
            break;

          case VoucherType.Types.RECEIPT:
            logger.debug('Type: RECEIPT');

            if (LedgerGroup.Types.isCashOrBank(cLedger.groupType)) {
              err = msg.get(3002);
            } else if (!LedgerGroup.Types.isCashOrBank(dLedger.groupType)) {
              err = msg.get(3001);
            }

            break;

        }

        if (err != null) {
          cb.error(err);
        } else {
          cb.next();
        }

      }, cb.error);
    }

    //------------------------------------------------------//
    // Validating Unique Ledger Ids.
    //------------------------------------------------------//
    function _validateVoucher(cb) {
      logger.debug('Validating voucher id');
      this.find('id').from('voucher_item').where('voucherId=?', [data.id]).exec(function(err, result) {

        if (result.length == 0) {
          return cb.error('Voucher id not found');
        }

        viLedger = util.queryArray(result);

        var t = ledgers.every(function(ledger) {
          if (ledger.id > 0) {
            if (viLedger.has(ledger.id)) {
              //ledger.update = true;
              viLedger.get(ledger.id).update = true;
            } else if (ledger.id > 0) {
              cb.error(new ApiError({message: 'Invalid voucher item id', ledger: ledger}));
              return false;
            }
          }
          return true;
        });

        logger.debug(JSON.stringify(result, null, 2));
        if (t == true) {
          optData = viLedger.getAll();
          cb.next();
        }

      }, cb.error);
    }

    //------------------------------------------------------//
    // Prepare against ledger
    //------------------------------------------------------//
    function _updateAgainstLedger(cb) {

      if (data.type != VoucherType.Types.JOURNAL) {
        logger.debug('Against Ledger : not journal');
        switch (data.type) {
          default:
            ledgers[0].againstLedgerId = ledgers[1].ledgerId;
            ledgers[1].againstLedgerId = ledgers[0].ledgerId;
        }
        return cb.next();
      }

      var isDebit, isCredit, spos = 0, did, cid;

      _init(0);

      ledgers.forEach(function(v, index) {

        if ((isDebit && v.credit > 0) || (isCredit && v.debit > 0)) {
          if (isDebit) {
            cid = v.ledgerId;
          } else {
            did = v.ledgerId;
          }
          for (var i = spos; i <= index; i++) {
            ledgers[i].againstLedgerId = (ledgers[i].debit > 0) ? cid : did;
          }
          spos = index + 1;
          _init(spos);
        }
      });

      function _init(pos) {
        if (pos >= ledgers.length) return;
        var v = ledgers[pos];
        isDebit = v.debit > 0;
        isCredit = v.credit > 0;
        did = isDebit ? v.ledgerId : 0;
        cid = isCredit ? v.ledgerId : 0;
      }

      cb.next();
      //------------------------------------------------------//
    }
  };

  function _insertOrUpdate(kind, data, opt, callback) {

    opt = opt || {};
    opt.validate = opt.validate || true;

    var voucher, con, optData;

    tr.series()
      .context(this)
      .then(_validate)
      .then(_beginTrans)
      .then(_updateVoucher)
      .then(_prepareVoucherItem)
      .then(_insertVoucherItem)
      .then(_updateVoucherItem)
      .then(_deleteVoucherItem)
      .then(_updateInventory)
      .onError(_done)
      .exec(_done);

    function _validate(cb) {
      if (opt.validate == false) {
        cb.next(null, newData);
      } else {
        this.validate(kind, data, opt, cb.next);
      }
    }

    function _beginTrans(cb, err, newData) {
      if (err) {
        return cb.error(err);
      }
      voucher = newData.data;
      optData = newData.optData;

      logger.debug('New Data', JSON.stringify(newData, null, 2));
      db.getConnectionWithTrans(cb.next);
    }

    function _updateVoucher(cb, err, connection) {

      con = connection;
      logger.debug('insertVoucher');

      var data = [{
        ref: voucher.ref,
        type: voucher.type,
        narration: voucher.narration,
        createdAt: new Date()
      }];

      if (kind == 'insert') {
        //_super.insert.call(this, data, con, cb.next, cb.error);
      } else {
        // configuration needed.
        //_super.updateById.call(this, data, con, cb.next, cb.error);
      }

      cb.next();

    }

    function _prepareVoucherItem(cb) {
      logger.debug('_updateVoucherItems');

      var iItems = [];
      var uItems = [];
      var dItems = [];

      // check voucher.ledgers in validate.
      voucher.ledgers.forEach(function(ledger) {

        if (ledger.id == 0) {
          iItems.push([
            this.id,
            ledger.ledgerId,
            ledger.debit,
            ledger.credit,
            ledger.narration
          ]);

        } else if (optData.hasOwnProperty(ledger.id) && optData[ledger.id].update) {
          uItems.push(ledger);

        }

      }.bind(voucher));

      for (var k in optData) {
        if (!optData[k].update) {
          dItems.push(parseInt(k));
        }
      }

      logger.debug('Insert Ledgers----------------:');
      logger.debug(JSON.stringify(iItems, null, 2));
      logger.debug('Update Ledgers----------------:');
      logger.debug(JSON.stringify(uItems, null, 2));
      logger.debug('Delete Ledgers----------------:');
      logger.debug(JSON.stringify(dItems, null, 2));

      cb.next(iItems, uItems, dItems);

    }

    function _insertVoucherItem(cb, iItems, uItems, dItems) {
      if (iItems.length == 0) {
        return cb.next(uItems, dItems);
      }
      db.exec("INSERT INTO voucher_item (voucherId,ledgerId,debit,credit,narration) VALUES ?", [iItems], con, function(err) {
        cb.next(uItems, dItems);
      }, cb.error);
    }

    function _updateVoucherItem(cb, uItems, dItems) {

      if (uItems.length == 0) {
        return cb.next(dItems);
      }

      tr.each(uItems).context(this).exec(function(callback, item) {
        db.exec('UPDATE voucher_item SET ? WHERE id=?', [item, item.id], con, callback, cb.error);
      }, function() {
        cb.next(dItems);
      });

    }

    function _deleteVoucherItem(cb, dItems) {
      if (dItems.length == 0) {
        return cb.next();
      }
      db.exec('DELETE FROM voucher WHERE id IN (?)', [dItems], con, cb.next, cb.error);
    }

    function _updateInventory(cb) {
      cb.next();
    }

    function _done(err, result) {
      return callback(err, result);

      if (err) {
        logger.debug('Has error - Doing rollback');
        db.rollback(err, callback);
      } else {
        logger.debug('Success');
        db.commit(con, function() {
          callback(null, result);
        });
      }
    }
  }

  this.findOne2 = function(id, callback) {
    var that = this;
    that.db.onError(callback).query('SELECT * FROM voucher WHERE id=?', [id], function(err, voucher) {
      if (voucher.length == 0) {
        return callback('Not found');
      }
      that.db.query('SELECT id,ledgerId,debit,credit,narration FROM voucher_item WHERE voucherId=?', [id], function(err, voucherItems) {
        voucher[0].ledgers = voucherItems;
        callback(err, voucher[0]);
      });
    })
  };

  this.getSummary = function(config, callback) {

    logger.debug('in getSummary');

    //' IFNULL(v1.obDebit,0)  + IFNULL(v2.debit, 0) AS cbDebit,' +
    //' IFNULL(v1.obCredit,0)  + IFNULL(v2.credit, 0) AS cbCredit' +

    config = util.extend({
      ledgerWise: true,
      fromDate: null,
      toDate: null,
      groupNature: null
    }, config);

    var ledIndex = {}
      , ledgers
      , totDebit = 0
      , totCredit = 0
      , diffDebit = 0
      , diffCredit = 0
      , db = this.db;

    //---------------------------------------//
    db.onError(_done);

    var params = [];

    var sql = 'SELECT IFNULL(SUM(debit),0)-IFNULL(SUM(credit),0) AS amount FROM ledger;';

    sql += 'SELECT led.id AS ledgerId,' +
      ' led.name,' +
      ' led.groupId,' +
      ' IFNULL(v1.obDebit,0) AS obDebit,' +
      ' IFNULL(v1.obCredit,0) AS obCredit,' +
      ' IFNULL(v2.debit, 0) AS debit,' +
      ' IFNULL(v2.credit,0) AS credit' +
      ' FROM ledger led' +
      ' LEFT JOIN (' +
      ' SELECT ledgerId,SUM(debit) AS obDebit, SUM(credit) AS obCredit' +
      ' FROM view_voucher' +
      ' WHERE type=1' +
      ' GROUP BY ledgerId' +
      ' ) v1 ON led.id = v1.ledgerId' +
      ' LEFT JOIN (' +
      ' SELECT ledgerId,SUM(debit) AS debit, SUM(credit) AS credit' +
      ' FROM view_voucher' +
      ' WHERE type>1' +
      ' GROUP BY ledgerId' +
      ' ) v2 ON led.id = v2.ledgerId';

    if (Array.isArray(config.groupNature) && config.groupNature.length > 0) {
      sql += ' WHERE led.groupNature' + ((config.groupNature.length == 1) ? '=?' : ' IN(?)');
      params.push(config.groupNature);
    }

    sql += ' GROUP BY ledgerId HAVING obDebit>0 OR obCredit>0 OR debit>0 OR credit>0';

    db.query(sql, params, function(err, results) {

      ledgers = results[1];
      if (ledgers.length == 0) {
        return callback(null, []);
      }

      var amt = results[0][0].amount;
      if (amt > 0) {
        diffCredit = amt;
      } else {
        diffDebit = Math.abs(amt);
      }

      var groupIds = [];

      ledgers.forEach(function(ledger, index) {
        if (!ledIndex.hasOwnProperty(ledger.groupId)) {
          ledIndex[ledger.groupId] = [];
        }
        ledIndex[ledger.groupId].push(index);
        groupIds.push(ledger.groupId);

        _tt2(ledger, 'obDebit', ledger.obDebit, 'obCredit', ledger.obCredit);
        _tt2(ledger, 'debit', ledger.debit, 'credit', ledger.credit);
        _tt2(ledger, 'cbDebit', ledger.obDebit + ledger.debit, 'cbCredit', ledger.obCredit + ledger.credit);

        totDebit += ledger.cbDebit;
        totCredit += ledger.cbCredit;

      });

      totDebit += diffDebit;
      totCredit += diffCredit;

      logger.debug('final step');

      if (config.ledgerWise == true) {
        return _done();
      }

      //{groupIds: groupIds}
      new LedgerGroup(db).getTree(groupIds, function(err, tree) {
        _parse(tree);
        ledgers = tree;
        _done();
      });

    });

    function _tt2(ledger, debitKey, debitVal, creditKey, creditVal) {
      if (debitVal > creditVal) {
        ledger[debitKey] = debitVal - creditVal;
        ledger[creditKey] = 0;
      } else {
        ledger[debitKey] = 0;
        ledger[creditKey] = creditVal - debitVal;
      }
    }

    function _parse(tree) {

      var debit = 0, credit = 0, obDebit = 0, obCredit = 0;
      tree.forEach(function(group) {
        var res = _parse(group.children);
        debit = res.debit;
        credit = res.credit;
        obDebit = res.obDebit;
        obCredit = res.obCredit;
        if (ledIndex.hasOwnProperty(group.id)) {
          var leds = [];
          ledIndex[group.id].forEach(function(pos) {
            var ledger = ledgers[pos];
            debit += ledger.debit;
            credit += ledger.credit;
            obDebit += ledger.obDebit;
            obCredit += ledger.obCredit;
            leds = ledger;
          });
          if (leds.length > 0) group.ledgers = leds;
        }
        group.obDebit = obDebit;
        group.obCredit = obCredit;
        group.debit = debit;
        group.credit = credit;
      });

      return {obDebit: obDebit, obCredit: obCredit, debit: debit, credit: credit};

    }

    function _done(err) {
      if (err) {
        //return callback(err);
      }
      callback(null, {
        ledgers: ledgers,
        difference: {
          name: 'Opening Balance (diff)',
          debit: diffDebit,
          credit: diffCredit
        },
        total: {
          debit: totDebit,
          credit: totCredit
        }
      });

    }
  }

}

nodeUtil.inherits(Voucher, Base);
module.exports = Voucher;

//
//var data = {
//  id: 1,
//  ref: '123',
//  type: VoucherType.Types.PAYMENT,
//  ledgers: [
//    {
//      id: 1,
//      ledgerId: 1,
//      debit: 100,
//      credit: 0,
//      narration: '123'
//    },
//    {
//      id: 0,
//      ledgerId: 3,
//      debit: 0,
//      credit: 100,
//      narration: '123'
//    }
//  ]
//};
//
//var v = new Voucher();
//v.update(data, {}, function(err, res) {
//  logger.debug('-----------------------------');
//  logger.debug(JSON.stringify(err, null, 2));
//  logger.debug(JSON.stringify(res, null, 2));
//  logger.debug('-----------------------------');
//});
