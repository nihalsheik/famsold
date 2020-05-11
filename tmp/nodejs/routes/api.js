/**
 * Created by sheik on 04-12-2015.
 */
var express = require('express');
var router = express.Router();
var logger = require('../helpers/logger');
var ApiError = require('../helpers/api_error');

var ledgerCtrl = require('../controllers/ledger_ctrl');
var invCtrl = require('../controllers/inventory_ctrl');
var unitCtrl = require('../controllers/unit_ctrl');
var vtCtrl = require('../controllers/voucher_type_ctrl');

var ledgerGroupCtrl = require('../controllers/ledger_group_ctrl');
var voucherCtrl = require('../controllers/voucher_ctrl');
var reportCtrl = require('../controllers/report_ctrl');
var acBookCtrl = require('../controllers/account_book_ctrl');
var testCtrl = require('../controllers/test_ctrl');
var db = require('../models/db');

//var mysql = require('mysql');
//var config = require('../conf/config.json');
//var pool = mysql.createPool(config.db);

function responseHandler(err, result, req, res, next) {
  if (err) {
    return errorHandler(err, req, res, next);
  }
  res.json({
    status: this.statusCode,
    type: 'success',
    response: result
  });
}

function errorHandler(err, req, res, next) {
  logger.debug('Error Handler');
  logger.error(err);
  if (typeof err == 'number' || !(err instanceof ApiError)) {
    err = new ApiError(err);
  }
  res.statusCode = res.statusCode == 200 ? err.statusCode || 400 : res.statusCode;
  res.json(err).end();
}

// middleware to use for all requests
router.use(function(req, res, next) {

  logger.debug('-------------------------------------------------------------------------------------------------------');

  logger.debug(' %s %s %s', req['x-real-ip'] ? req['x-real-ip'] : req.ip, req.method, req.originalUrl);

  /*
  res.on('finish', function() {
    db.clean(req.dbConnection);
    logger.debug('CLEANUP');
    logger.debug('-------------------------------------------------------------------------------------------------------\n\n');
  });
  */

  res.ok = function(result) {
    responseHandler(null, result, req, res, next);
  };
  res.error = function(err) {
    errorHandler(err, req, res, next);
  };
  res.done = function(err, result) {
    responseHandler(err, result, req, res, next);
  };

  /*
  db.getConnection(function(err, connection) {
    if (err) {
      //@Fixme
      //return that.throwError.call(this, err, callback);
    }
    req.dbConnection = connection;
    next();
  });
  */

  next();

});

router.get('/ping', function(req, res) {
  logger.debug(req.app.get('test-global-var'));
  res.send('ping');
});

// :lid-> ledgerId
// :vid-> voucherId
// :gid-> groupId

/**
 * LEDGER
 * -----------------------------------------------------------------
 */

router.post('/ledger', ledgerCtrl.create);
router.route('/ledger/:lid')
  .put(ledgerCtrl.update)
  .get(ledgerCtrl.getOne)
  .delete(ledgerCtrl.delete);
router.get('/ledgers', ledgerCtrl.getList);

router.post('/inventory', invCtrl.create);
router.get('/inventory/list', invCtrl.getList);
router.route('/inventory/:iid')
  .get(invCtrl.getOne)
  .put(invCtrl.update)
  .delete(invCtrl.delete);

router.post('/unit', unitCtrl.create);
router.get('/unit/list', unitCtrl.getList);
router.route('/unit/:uid')
  .get(unitCtrl.getOne)
  .put(unitCtrl.update)
  .delete(unitCtrl.delete);

router.post('/voucher_type', vtCtrl.create);
router.get('/voucher_type/list', vtCtrl.getList);
router.route('/voucher_type/:vtid')
  .get(vtCtrl.getOne)
  .put(vtCtrl.update)
  .delete(vtCtrl.delete);

router.get('/account_book/get_ledger', acBookCtrl.getLedger);
router.get('/account_book/get_ledger_summary_by_group', acBookCtrl.getLedgerSummaryByGroup);
router.get('/account_book/get_summary', acBookCtrl.getSummary);
router.get('/account_book/get_opening_balance', acBookCtrl.getOpeningBalances);

/**
 * LEDGER GROUP
 * -----------------------------------------------------------------
 */
router.post('/group', ledgerGroupCtrl.create);
router.route('/group/:gid')
  .put(ledgerGroupCtrl.update)
  .get(ledgerGroupCtrl.getOne)
  .delete(ledgerGroupCtrl.delete);
router.get('/groups', ledgerGroupCtrl.getList);
router.get('/groups/tree', ledgerGroupCtrl.getTree);

/**
 * VOUCHER
 * -----------------------------------------------------------------
 */
router.post('/voucher', voucherCtrl.create);
router.get('/voucher/getTypes', voucherCtrl.getVoucherTypes);
router.route('/voucher/:vid')
  .get(voucherCtrl.findOne)
  .put(voucherCtrl.update)
  .delete(voucherCtrl.deleteVoucher);

/**
 * REPORTS
 * -----------------------------------------------------------------
 */
//router.get('/report/ledger/:lid', reportCtrl.getAccountLedger);
router.get('/report/trial_balance', reportCtrl.getTrialBalance);
router.get('/report/profit_and_loss', reportCtrl.getProfitAndLoss);
router.get('/report/balance_sheet', reportCtrl.getBalanceSheet);

router.get('/test/result', testCtrl.getResult);
router.get('/test/getDetail', testCtrl.getDetail);

/**
 * For 404 Error
 */
router.use(function(req, res, next) {
  var err = new ApiError('URL not found');
  err.status = 404;
  res.status(404).json(err).end();
});

//@Fixme Temproarly Removed for Dev. purpose
//router.use(errorHandler);

module.exports = router;