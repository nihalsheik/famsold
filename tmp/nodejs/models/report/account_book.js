/**
 * Created by sheik on 22-01-2016.
 */

var nodeUtil = require('util');
var Base = require('../base');
var logger = require('../../helpers/logger');
var util = require('../../helpers/util');
var fv = require('../../helpers/validator');
var ApiError = require('../../helpers/api_error');
var tr = require('../../helpers/task_runner');
var config = require('../../conf/config.json');
var validator = require('../../helpers/validator');
var vType = validator.Types;

function AccountBook(db) {
  Base.call(this, db);
}
nodeUtil.inherits(AccountBook, Base);
module.exports = AccountBook;

AccountBook.prototype.getOpeningBalance = function(callback) {
  this.find({table: 'ledger', fields: 'id,name,debit,credit'}, function(err, ledgers) {
    var results = [];
    ledgers.forEach(function(ledger) {
      if (ledger.debit > 0 || ledger.credit > 0) {
        results.push(ledger);
      }
    });
    callback(err, results);
  })
};

AccountBook.prototype.getDiffBalance = function(callback) {

  this.db.query('SELECT IFNULL(SUM(debit),0)-IFNULL(SUM(credit),0) AS amount FROM ledger', function(err, result) {

    var resp = {name: 'Opening Balance (diff)', debit: 0, credit: 0};

    if (err) {
      return callback(resp);
    }

    var amt = result[0].amount;
    if (amt > 0) {
      resp.credit = amt;
    } else {
      resp.debit = Math.abs(amt);
    }

    callback(resp);

  });

};

/**
 *
 * @param data
 * @param callback
 */
AccountBook.prototype.getLedger = function(cfg, callback) {

  var data = {};
  var err = validator.validate({
    source: cfg,
    fieldMap: {
      fromDate: {type: vType.DATE},
      toDate: {type: vType.DATE},
      page: {type: vType.NUMERIC},
      limit: {type: vType.NUMERIC}
    },
    fillTo: data,
    option: {
      throwIfError: false
    }
  });

  if (err) {
    return callback(err);
  }

  data.limit = config.report.pageLimit;
  data.page = parseInt(data.page) - 1;

  var params = [
    data.ledgerId,
    data.page * data.limit,
    data.limit
  ];

  var db = this.db.onError(_done);

  tr
    .series([
      _getOpeningBalance,
      _getSum,
      _getTotalRecord,
      _getDetail
    ])
    .context(this)
    .exec(_done);

  function _getOpeningBalance(cb) {
    if (data.page > 0) {
      return cb.skip(2).next(0, 0, 0);
    }
    var sql = 'SELECT SUM(debit) AS debit,SUM(credit) AS credit FROM voucher_item WHERE ledgerId=1';
    db.query(sql, params, function(err, openingBalance) {
      cb.next(openingBalance[0]);
    });
  }

  function _getSum(cb, openingBalance) {
    var sql = 'SELECT SUM(debit) AS debit,SUM(credit) AS credit FROM voucher_item WHERE ledgerId=1';
    db.query(sql, params, function(err, closingBalance) {
      cb.next(openingBalance, closingBalance[0]);
    });
  }

  function _getTotalRecord(cb, openingBalance, closingBalance) {
    var p = [data.ledgerId];
    var sql = 'SELECT COUNT(id) AS totalRecord FROM voucher_item WHERE ledgerId=1';
    if (data.fromDate) {
      sql += ' AND createdAt>=?';
      p.push(data.fromDate);
    }
    if (data.toDate) {
      sql += ' AND createdAt<=?';
      p.push(data.toDate);
    }
    db.query(sql, p, function(err, totalRecords) {
      cb.next(openingBalance, closingBalance, totalRecords[0]);
    });
  }

  function _getDetail(cb, openingBalance, closingBalance, totalRecords) {
    var sql = 'SELECT vt.name as type,v.createdAt AS date,vi.voucherId,led.name,vi.debit,vi.credit,vi.narration' +
      ' FROM voucher_item vi' +
      ' LEFT JOIN voucher v ON (vi.voucherId = v.id)' +
      ' LEFT JOIN ledger led ON (vi.againstLedgerId = led.id)' +
      ' LEFT JOIN voucher_type vt ON (v.type = vt.id)' +
      ' WHERE vi.ledgerId=?' +
      ' LIMIT ?,?';

    db.query(sql, params, function(err, ledgers) {
      cb.done(null, openingBalance, closingBalance, totalRecords, ledgers);
    });
  }

  function _done(err, openingBalance, closingBalance, totalRecords, ledgers) {

    if (err) {
      return callback(err);
    }
    var result = {ledgers: ledgers};
    if (data.page == 0) {
      result.openingBalance = openingBalance;
      result.current = closingBalance;
      result.totalRecords = totalRecords;
      result.closingBalance = {debit: 0, credit: 0};
      if (closingBalance.debit > closingBalance.credit) {
        result.closingBalance.debit = closingBalance.debit - closingBalance.credit;
      } else {
        result.closingBalance.credit = closingBalance.credit - closingBalance.debit;
      }
    }
    callback(null, result);
  }

};

/**
 *
 * @param data
 * @param callback
 * @returns {*}
 */
AccountBook.prototype.getSummary = function(data, callback) {

  var res = fv.validate({
    source: data,
    fieldMap: {
      ledgerId: {
        type: vType.NUMERIC,
        allowNull: false
      },
      type: {
        required: true,
        type: vType.STRING,
        allowedValues: ['day', 'week', 'month', 'quarter', 'half']
      },
      dateFrom: {
        type: vType.DATE
      },
      dateTo: {
        type: vType.DATE
      }
    },
    option: {throwIfError: false}
  });

  if (res != null) {
    return callback(res);
  }

  data.ledgerId = util.isEmpty(data.ledgerId) ? [] : data.ledgerId.split(',').map(Number);
  data.groupId = util.isEmpty(data.groupId) ? [] : data.groupId.split(',').map(Number);

  if (data.ledgerId.length == 0 && data.groupId.length == 0) {
    return callback(new ApiError('Ledger Id OR Grpup Id should not be empty'));
  }

  var ledgerId = data.ledgerId;
  var type = data.type || 'month';
  var dateFrom = data.dateFrom;
  var dateTo = data.dateTo;
  var db = this.db;

  db.onError(_done);

  function _getOpeningBalance() {
    var sql = 'SELECT SUM(debit) AS debit, SUM(credit) AS credit FROM view_voucher WHERE';
    var ps = _prepareSql(data, 0);
    sql += ps.sql;
    var params = ps.params;

    db.query(sql, params, function(err, openingBalance) {
      openingBalance = openingBalance.length > 0 ? openingBalance[0] : {};
      _getSummary(openingBalance);
    });
  }

  function _getSummary(openingBalance) {

    var cols = '';
    var grp = '';

    switch (type) {
      case 'day':
        cols = ',MONTH(createdAt) month, WEEKOFYEAR(createdAt) week, DAY(createdAt) day';
        grp = ',MONTH(createdAt),DAY(createdAt)';
        break;
      case 'week':
        cols = ',MONTH(createdAt) month, WEEKOFYEAR(createdAt) week';
        grp = ',WEEKOFYEAR(createdAt)';
        break;
      case 'month':
        cols = ',MONTH(createdAt) month';
        grp = ',MONTH(createdAt)';
        break;
      case 'quarter':
        cols = ',QUARTER(createdAt) quarter';
        grp = ',QUARTER(createdAt)';
        break;
      case 'half':
        cols = ',CEIL(MONTH(createdAt) / 6) as halfYear';
        grp = ',CEIL(MONTH(createdAt) / 6)';
        break;
    }

    var sql = 'SELECT YEAR(createdAt) year' + cols +
      ',SUM(debit) AS debit, SUM(credit) AS credit' +
      ' FROM view_voucher WHERE';

    var ps = _prepareSql(data, 1);
    sql += ps.sql;
    sql += ' GROUP BY YEAR(createdAt)' + grp;
    var params = ps.params;

    db.query(sql, params, function(err, result) {

      result.forEach(function(e) {
        if (e.debit > e.credit) {
          e.cbDebit = e.debit - e.credit;
          e.cbCredit = 0;
        } else {
          e.cbDebit = 0;
          e.cbCredit = e.credit - e.debit;
        }
      });

      _done(null, {
        openingBalance: openingBalance,
        current: result
      });
    });
  }

  function _done(err, result) {
    callback(err, result);
  }

  function _prepareSql(data, flag) {

    var params = [];
    var sql = '';

    if (data.ledgerId.length > 0) {
      if (data.ledgerId.length == 1) {
        sql += ' ledgerId=?';
      } else {
        sql += ' ledgerId IN (?)';
      }
      params.push(data.ledgerId);

    } else if (data.groupId.length > 0) {
      sql += ' ledgerId IN (SELECT id FROM ledger WHERE ';
      if (data.groupId.length == 1) {
        sql += 'groupId=?';
      } else {
        sql += 'groupId IN (?)';
      }
      sql += ')';
      params.push(data.groupId);
    }

    if (flag == 0) {
      if (data.dateFrom) {
        sql += ' AND (type=1 OR createdAt<?)';
        params.push(data.dateFrom);
      } else {
        sql += ' AND type=1';
      }
    } else {
      if (data.dateFrom) {
        sql += ' AND (type=1 OR createdAt>=?)';
        params.push(data.dateFrom);
      }
      if (dateTo) {
        sql += ' AND createdAt<=?';
        params.push(data.dateTo);
      }
    }

    return {sql: sql, params: params};
  }

  _getOpeningBalance();

};

/**
 *
 * @param config
 * @param callback
 */
AccountBook.prototype.getLedgerWiseSummary = function(config, callback) {

  var data = {};
  var err = validator.validate({
    source: config,
    fieldMap: {
      fromDate: {type: vType.DATE},
      toDate: {type: vType.DATE},
      groupNature: {
        type: vType.ARRAY,
        allowedValues: [1, 2, 3, 4]
      },
      groupId: {
        type: vType.NUMERIC,
        defaultValue: 0
      },
      includeChildGroups: {
        type: vType.BOOLEAN,
        defaultValue: true
      },
      includeDiffBalance: {
        type: vType.BOOLEAN,
        defaultValue: true
      }
    },
    fillTo: data,
    option: {
      throwIfError: false
    }
  });

  if (err) {
    return callback(err);
  }

  var that = this;

  this.db.onError(callback);

  tr
    .series()
    .context(this)
    .then(_getDiffBalance)
    .then(_getGroupIds)
    .then(_getLedgers)
    .exec(callback);

  function _getDiffBalance(cb) {
    logger.debug('in _getDiffBalance');
    if (!data.includeDiffBalance) {
      return cb.next();
    }

    that.getDiffBalance(function(diff) {
      diff.groupId = diff.debit > diff.credit ? 1 : 2;
      cb.next(diff);
    });

  }

  function _getGroupIds(cb, diff) {
    logger.debug('in _getGroupIds');

    if (parseInt(data.groupId) < 1) return cb.next(diff);

    var groupId = [data.groupId];

    if (!data.includeChildGroups) return cb.next(diff);

    (function _iterate(parentIds) {
      that.db.query('SELECT id FROM ledger_group WHERE parentId IN (?)', [parentIds], function(err, result) {
        var gids = [];
        result.forEach(function(group) {
          gids.push(group.id)
        });
        if (gids.length > 0) {
          groupId = groupId.concat(gids);
          _iterate(gids);
        } else {
          cb.next(diff);
        }
      });
    })(groupId);

  }

  function _getLedgers(cb, diff) {

    var params = [];

    var sql = 'SELECT ledger.id,' +
      'ledger.name,' +
      'ledger.groupId,' +
      'IFNULL(SUM(voucher.debit),0) AS debit,' +
      'IFNULL(SUM(voucher.credit),0) AS credit' +
      ' FROM ledger' +
      ' LEFT JOIN view_voucher AS voucher ON ledger.id=voucher.ledgerId';

    if (Array.isArray(data.groupNature) && data.groupNature.length > 0) {
      sql += ' WHERE ledger.groupNature IN (?)';
      params.push(data.groupNature);

    } else if (Array.isArray(data.groupId) && data.groupId.length > 0) {
      sql += ' WHERE ledger.groupId IN (?)';
      params.push(data.groupId);
    }

    sql += ' GROUP BY ledger.id HAVING debit>0 OR credit>0';

    that.db.query(sql, params, function(err, ledgers) {
      cb.done(err, {ledgers: ledgers, difference: diff});
    });
  }

};
