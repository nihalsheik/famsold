var LedgerGroup = require('../models/ledger_group');
var Voucher = require('../models/voucher');
var Ledger = require('../models/ledger');
var Inventory = require('../models/inventory');
var Unit = require('../models/unit');
var VoucherType = require('../models/voucher_type');

var FinancialReport = require('../models/report/financial_report');
var AccountManager = require('../models/account_manager');
var AccountBook = require('../models/report/account_book');

exports.getLedgerGroup = function() {
  return new LedgerGroup()
};

exports.getVoucher = function() {
  return new Voucher()
};

exports.getLedger = function() {
  return new Ledger()
};

exports.getFinancialReport = function() {
  return new FinancialReport();
};

exports.getAccountManager = function() {
  return new AccountManager();
};

exports.getAccountBook = function() {
  return new AccountBook();
};

exports.getInventory = function() {
  return new Inventory();
};

exports.getUnit = function() {
  return new Unit();
};

exports.getVoucherType = function() {
  return VoucherType.instance();
};

