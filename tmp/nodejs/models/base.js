var logger = require('../helpers/logger');
var Query = require('./query');
var db = require('./db');

(function(module) {

  function Base(table) {
    var data = {};

    this.table = table;

    this.data = function(key, val) {
      if (val) {
        data[key] = val;
      } else {
        return data[key];
      }
    };

  }

  Base.prototype.find = function(fields) {
    return Query.select(fields).from(this.table);
  };

  Base.prototype.findOne = function(fields) {
    return this.find(fields).limit(1);
  };

  Base.prototype.findById = function(id, fields) {
    return this.find(fields).where('id=?', [id]);
  };

  Base.prototype.insert = function(data, con, success, error) {
    db.insert(this.table, data, con, success, error);
  };

  Base.prototype.updateById = function(data, con, success, error) {
    db.update(this.table, data, 'id=?', [data.id], con, success, error);
  };

  Base.prototype.deleteById = function(id, con, success, error) {
    db.delete(this.table, 'id=?', [id], con, success, error);
  };

  module.exports = Base;

})(module);
