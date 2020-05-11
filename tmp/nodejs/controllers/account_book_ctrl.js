/**
 * Created by sheik on 22-01-2016.
 */

var ModelFactory = require('../helpers/model_factory');

exports.getLedger = function(req, res) {
  ModelFactory.getAccountBook(req.db).getLedger(req.query, res.done);
};

exports.getSummary = function(req, res) {
  ModelFactory.getAccountBook(req.db).getSummary(req.query, res.done);
};

exports.getOpeningBalances = function(req, res) {
  ModelFactory.getAccountBook(req.db).getOpeningBalance(res.done);
};

exports.getLedgerSummaryByGroup = function(req, res) {
  req.query.includeDiffBalance = 'false';
  ModelFactory.getAccountBook(req.db).getLedgerWiseSummary(req.query, res.done);
};
