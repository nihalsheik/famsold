/**
 * Created by sheik on 08-01-2016.
 */

var logger = require('../../helpers/logger');
var ModelFactory = require('../../helpers/model_factory');
var util = require('../../helpers/util');
var LedgerGroup = require('../ledger_group');

function FinancialReport(db) {

  this.getTrialBalance = function(cfg, callback) {

    logger.debug('in trialBalance');

    if (cfg instanceof Function) {
      callback = cfg;
      cfg = {};
    }

    var config = util.extend({
      ledgerWise: true,
      fromDate: null,
      toDate: null,
      groupNature: null
    }, cfg);

    ModelFactory
      .getAccountBook(db)
      .getLedgerWiseSummary({
        ledgerWise: config.ledgerWise
      },
      callback
    );
  };

  /**
   *
   * @param config
   * @param callback
   */
  this.getProfitAndLoss = function(config, callback) {

    ModelFactory
      .getAccountBook(db)
      .getLedgerWiseSummary({
        groupNature: [3, 4]
      },
      function(err, results) {
        if (err) {
          return callback(err);
        }

        _joinWithGroups([3, 4, 5, 6, 7, 8], results, function(err, tree) {

          var income = {}
            , expense = {}
            , directIncome = {}
            , directExpense = {}
            , indirectIncome = {}
            , indirectExpense = {};

          tree.forEach(function(group) {
            if (group.id == 3) {
              income = group
            } else if (group.id == 4) {
              expense = group
            }
            group.children.forEach(function(g) {
              switch (g.id) {
                case 5:
                  directIncome = g;
                  break;
                case 6:
                  directExpense = g;
                  break;
                case 7:
                  indirectIncome = g;
                  break;
                case 8:
                  indirectExpense = g;
                  break;
              }
            });
          });

          var d = directExpense.debit + directIncome.debit;
          var c = directExpense.credit + directIncome.credit;
          var amt = 0;

          if (c > d) {
            amt = c - d;
            directExpense.children.push({name: 'Cross Profit C/F', debit: amt, credit: 0});
            indirectIncome.children.push({name: 'Cross Profit B/F', debit: 0, credit: amt});
            directExpense.debit += amt;
            indirectIncome.credit += amt;

          } else if (d > c) {
            amt = d - c;
            directIncome.children.push({name: 'Cross Loss C/F', debit: 0, credit: amt});
            indirectExpense.children.push({name: 'Cross Loss B/F', debit: amt, credit: 0});
            directIncome.credit += amt;
            indirectExpense.debit += amt;
          }

          d = indirectExpense.debit + indirectIncome.debit;
          c = indirectExpense.credit + indirectIncome.credit;
          if (d > c) {
            amt = d - c;
            indirectIncome.children.push({name: 'Net Loss C/F', debit: 0, credit: amt});
            indirectIncome.credit += amt;

          } else if (c > d) {
            amt = c - d;
            indirectExpense.children.push({name: 'Net Profit C/F', debit: amt, credit: 0});
            indirectExpense.debit += amt;
          }

          callback(err, tree);

        });
      }
    );
  };

  /**
   *
   * @param config
   * @param callback
   */
  this.getBalanceSheet = function(config, callback) {

    ModelFactory.getAccountBook(db).getLedgerWiseSummary({
      groupNature: [1, 2],
      includeDiffBalance: true
    }, function(err, result) {

      if (err) {
        return callback(err);
      }

      result.ledgers.push(result.difference);

      ModelFactory.getAccountManager(db).getNetProfitOrLoss(function(pl) {
        var t = {
          name: 'Profit & Loss A/c',
          debit: pl.netLoss,
          credit: pl.netProfit
        };
        if (pl.netProfit > pl.netLoss) {
          t.groupId = 2;
        } else {
          t.groupId = 1;
        }
        result.ledgers.push(t);
        _joinWithGroups([1, 2], result, callback);
      });

    });

  };

  function _joinWithGroups(defaultGid, result, callback) {

    var groupIds = []
      , ledIndex = {}
      , totDebit = 0
      , totCredit = 0;

    var ledgers = result.ledgers;

    ledgers.forEach(function(ledger, index) {
      if (!ledIndex.hasOwnProperty(ledger.groupId)) {
        ledIndex[ledger.groupId] = [];
      }
      ledIndex[ledger.groupId].push(index);
      groupIds.push(ledger.groupId);

      _tt2(ledger, 'debit', ledger.debit, 'credit', ledger.credit);

      totDebit += ledger.debit;
      totCredit += ledger.credit;
    });

    if (defaultGid.length > 0) {
      groupIds = groupIds.concat(defaultGid);
    }

    new LedgerGroup(db).getTree(groupIds, function(err, tree) {
      _parse(tree);
      callback(null, tree);
    });

    function _parse(tree) {

      if (!Array.isArray(tree)) {
        return [0, 0];
      }

      var debit = 0, credit = 0, cd = 0, cc = 0;

      tree.forEach(function(group) {

        var res = _parse(group.children);

        debit = res[0];
        credit = res[1];

        if (ledIndex.hasOwnProperty(group.id)) {
          ledIndex[group.id].forEach(function(pos) {
            var ledger = ledgers[pos];
            debit += ledger.debit;
            credit += ledger.credit;
            delete ledger.groupId;
            group.children.push(ledger);
          });
        }

        _tt2(group, 'debit', debit, 'credit', credit);

        cd += debit;
        cc += credit;
      });

      return [cd, cc];
    }

  }

  function _tt2(ledger, debitKey, debitVal, creditKey, creditVal) {
    if (debitVal > creditVal) {
      ledger[debitKey] = debitVal - creditVal;
      ledger[creditKey] = 0;
    } else {
      ledger[debitKey] = 0;
      ledger[creditKey] = creditVal - debitVal;
    }
  }

}

module.exports = FinancialReport;
