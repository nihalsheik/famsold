/**
 * Created by admin on 11-08-2015.
 */

var logger = require('../helpers/logger');
var db = require('../models/db');
var ModelFactory = require('../helpers/model_factory');

exports.getTrialBalance = function(req, res, next) {
  ModelFactory
    .getFinancialReport(req.db)
    .getTrialBalance({
      ledgerWise: req.query.ledgerWise === 'true'
    }, res.done)
};

exports.getProfitAndLoss = function(req, res, next) {
  ModelFactory
    .getFinancialReport(req.db)
    .getProfitAndLoss({
      ledgerWise: req.query.ledgerWise === 'true'
    }, res.done)
};

exports.getBalanceSheet = function(req, res, next) {
  ModelFactory
    .getFinancialReport(req.db)
    .getBalanceSheet({
      ledgerWise: req.query.ledgerWise === 'true',
      includeBalance: req.query.includeBalance === 'true'
    }, res.done)
};