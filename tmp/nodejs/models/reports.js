/**
 * Created by sheik on 08-12-2015.
 */
var logger = require('../helpers/logger');
var db = require('../models/db');

exports.getAccountLedger = function(data, callback) {

  logger.debug('getAccountLedger');

  //this.getBalance(function(res) {
  //  console.log(res);
  //});

  // PUT Validation

  var ledgerId = parseInt(data.ledgerId);
  var dateFrom = data.dateFrom;
  var dateTo = data.dateTo;

  var where = [ledgerId];

  logger.debug('getGroup', ledgerId);

  var qry = 'SELECT vi.id, vi.ledgerId, vi.debit, vi.credit,led.name ,vi.narration' +
    ' FROM voucher v, voucher_item vi' + '' +
    ' LEFT JOIN ledger led ON vi.againstLedgerId = led.id' +
    ' WHERE v.id = vi.voucherId AND vi.ledgerId=?';

  if (dateFrom) {
    qry += ' AND v.createdAt>=?';
    where.push(dateFrom);
  }
  if (dateTo) {
    qry += ' AND v.createdAt<=?';
    where.push(dateTo);
  }

  db.query(qry, where, function(err, result) {
    console.log(this.sql);
    if (err) return callback(err);
    callback(null, result);
  });

};
