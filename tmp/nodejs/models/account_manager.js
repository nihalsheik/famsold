/**
 * Created by sheik on 12-01-2016.
 */

function AccountManager(db) {

  /**
   *
   * @param callback
   */
  this.getNetProfitOrLoss = function(callback) {

    var sql = 'SELECT ledger.groupNature As nature,' +
      'IFNULL(SUM(voucher.debit),0) AS debit,' +
      'IFNULL(SUM(voucher.credit),0) AS credit' +
      ' FROM ledger' +
      ' LEFT JOIN view_voucher AS voucher ON ledger.id=voucher.ledgerId' +
      ' WHERE ledger.groupNature=3 OR ledger.groupNature=4' +
      ' GROUP BY ledger.groupNature';

    db.query(sql, function(err, result) {
      var res = {netProfit: 0, netLoss: 0};
      if (err) {
        return callback(res);
      }
      var expense = 0, income = 0;

      result.forEach(function(g) {
        if (g.nature == 3) {
          income = g.credit - g.debit;
        } else if (g.nature == 4) {
          expense = g.debit - g.credit;
        }
      });

      if (income > expense) {
        res.netProfit = income - expense;
      } else {
        res.netLoss = expense - income;
      }

      callback(res);
    });

  };

  /**
   *
   * @param callback
   */
  this.getOpeningStock = function(callback) {

  };

  /**
   *
   * @param callback
   */
  this.getClosingStock = function(callback) {

  };

}

module.exports = AccountManager;

//var DB = require('./db');
//var acm = new AccountManager(new DB());
//
//acm.getNetProfitOrLoss(function(result) {
//  console.log(result);
//});
