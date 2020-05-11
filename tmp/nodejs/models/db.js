/**
 * Created by sheik on 05-12-2015.
 */
var logger = require('../helpers/logger');
var mysql = require('mysql');
var config = require('../conf/config.json');
var pool = mysql.createPool(config.db);
var Query = require('./query');

exports.getConnection = function(callback) {
  pool.getConnection(function(err, connection) {
    logger.debug('Total Connections : ', pool._allConnections.length);
    callback(err, connection);
  });
};

exports.getConnectionWithTrans = function(callback) {
  this.getConnection(function(err, connection) {
    if (err) {
      return callback(err);
    }
    this.beginTransaction(connection, callback);
  }.bind(this));
};

exports.clean = function(con) {
  try {
    if (con) {
      logger.debug('Connection successfully released');
      con.release();
    } else {
      logger.debug('No connection to release');
    }
  } catch (err) {
    logger.debug('Error in connection release');
  }
};

exports.beginTransaction = function(con, callback) {
  con.beginTransaction(function(err) {
    con.hasBeginTrans = true;
    callback(err, con);
  });
};

exports.commit = function(con, callback) {
  var that = this;
  con.commit(function(err) {
    if (err) {
      return that.rollback(err, callback);
    }
    logger.debug('commit');
    callback();
  });
};

exports.find = function(table, fields) {
  return Query.select(fields).from(table);
};
exports.findOne = function(table, fields) {
  return this.find(table, fields).limit(1);
};
exports.findById = function(table, id, fields) {
  return this.find(table, fields).where('id=?', [id]);
};

exports.rollback = function(con, callback) {
  logger.debug('rollback');
  con.rollback(callback);
};

exports.insert = function(table, data, con, success, error) {
  this.exec('INSERT INTO ' + table + ' SET ?', data, con, success, error);
};

exports.update = function(table, data, where, params, con, success, error) {
  params = [data].concat(params);
  this.exec('UPDATE ' + table + ' SET ? WHERE ' + where, params, con, success, error);
};

exports.delete = function(table, where, params, con, success, error) {
  this.exec('DELETE FROM ' + table + ' WHERE ' + where, params, con, success, error);
};

exports.exec = function(sql, params, con, success, error) {
  logger.debug('exec:');
  if (con instanceof Function) {
    this.getConnection(function(err, connection) {
      _exec(sql, params, connection, con, success, true);
    });
  } else {
    _exec(sql, params, con, success, error, false);
  }
};

function _exec(sql, params, con, success, error, release) {
  logger.debug('connected as id ' + con.threadId);
  con.query(sql, params, function(err, result) {
    if (release) {
      logger.debug('Release connection');
      con.release();
    }
    logger.debug('Query : ', this.sql);
    if (err && error instanceof Function) {
      return error.call(this, err);
    }
    success.call(this, err, result);
  });
}

//exports.exec('select * from ledger',null,function(err,res){
//});
//exports.exec('select * from ledger',null,function(err,res){
//});
//exports.exec('select * from ledger',null,function(err,res){
//});
//exports.exec('select * from ledger',null,function(err,res){
//});
//setTimeout(function(){
//  exports.exec('select * from ledger',null,function(err,res){
//    setTimeout(function(){
//      exports.exec('select * from ledger',null,function(err,res){
//        setTimeout(function(){
//          exports.exec('select * from ledger',null,function(err,res){
//          });
//        },1000);
//      });
//    },1000);
//  });
//},1000);

