var config = require('../conf/config.json');
var logger = require('../helpers/logger');
var db = require('./db');

function Query() {

  /**
   * @param table
   * @returns {Query}
   * ----------------------------------------------------------------------------------
   */
  /*
   this.insert = function(table) {
   var _data = {};
   this.data = function(data) {
   _data = data;
   return this;
   };
   this.exec = function(success, error) {
   _exec('INSERT INTO ' + table + ' SET ?', _data, function(err, result) {
   if (err) {
   if (err.code == 'ER_DUP_ENTRY') {
   err.message = 'Data already exist';
   }
   if (error) {
   return error(err);
   }
   } else {
   _data.id = result.insertId;
   }
   success(err, _data);
   });
   };
   return this;
   };
   */

  /**
   * @param table
   * @returns {Query}
   * ----------------------------------------------------------------------------------
   */
  /*
   this.update = function(table) {
   var _data = {}, _where = '', _params = null;
   this.data = function(data) {
   _data = data;
   return this;
   };
   this.where = function(where, params) {
   _where = where;
   _params = params;
   return this;
   };
   this.exec = function(success, error) {
   if (_where == '') {
   if (error) error(err); else success(err);
   return;
   }
   _params = [_data].concat(_params);
   _exec('UPDATE ' + table + ' SET ? WHERE ' + _where, _params,
   function(err, result) {
   success(err, _data);
   },
   function(err) {
   if (err.code == 'ER_DUP_ENTRY') {
   err.message = 'Data already exist';
   }
   if (error) {
   error(err);
   } else {
   success(err);
   }
   }
   );
   };
   return this;
   };
   */

  var data, con;

  _init();

  function _init() {
    data = {
      table: '',
      fields: '*',
      skip: 0,
      limit: null,
      where: ''
    };
  }

  exports.use = function(connection) {
    con = connection;
    return this;
  };

  this.select = function(fields) {
    data.fields = fields || '*';
    return this;
  };

  this.from = function(table) {
    data.table = table;
    return this;
  };

  this.where = function(where, params) {
    data.where = where;
    data.params = params;
    return this;
  };

  this.skip = function(skip) {
    data.skip = skip;
    return this;
  };

  this.limit = function(limit) {
    data.limit = limit;
    return this;
  };

  this.page = function(page, size) {
    size = size || 25;
    page = page || 0;
    data.skip = (page - 1) * size;
    data.limit = size;
    return this;
  };

  this.toSql = function() {

    var sql = 'SELECT ' + data.fields + ' FROM ' + data.table;

    if (data.where) {
      sql += ' WHERE ' + data.where;
    }
    if (data.limit) {
      sql += ' LIMIT ' + data.skip + ',' + data.limit;
    }
    return sql;
  };

  this.cache = function(flag) {
    data.cache = flag == true;
    return this;
  };

  this.exec = function(success, error) {
    if (con != null) {
      db.exec(con, this.toSql(), data.params, success, error);
    } else {
      db.exec(this.toSql(), data.params, success, error);
    }
  };

  return this;
}

exports.select = function(fields) {
  return new Query().select(fields);
};

//var mysql = require('mysql');
//var sql = 'UPDATE table SET ? WHERE id=? AND k=?';
//sql = mysql.format(sql,[{a:1,b:2},100,101]);
//var sql = mysql.format('INSERT INTO t SET ?', {a: 1});
//logger.debug(sql);
//return;

//var q = new Query();
//var sql = q.select().from('a').toSql()
//logger.debug(sql);