var nodeUtil = require('util');
var util = require('../helpers/util');
var tr = require('../helpers/task_runner');
var logger = require('../helpers/logger');
//var ApiError = require('../helpers/api_error');
var Base = require('./base');
var validator = require('../helpers/validator');
var vType = validator.Types;
var db = require('./db');

function LedgerGroup() {

  Base.call(this, 'ledger_group');
  var _super = LedgerGroup.super_.prototype;

  this.insert = function(data, callback) {
    this.validate('insert', data, function(err, newData) {
      if (err) return callback(err);
      _super.insert.call(this, newData, callback);
    }.bind(this));
  };

  this.updateById = function(data, callback) {
    this.validate('update', data, function(err, newData) {
      if (err) return callback(err);
      _super.updateById.call(this, newData, callback);
    }.bind(this));
  };

  this.validate = function(kind, data, callback) {

    var that = this;

    logger.debug('validate');

    var vRes = validator
      .validate(data)
      .fieldMap([
        {
          name: 'id',
          type: validator.Types.NUMERIC,
          rule: validator.Rules.POSITIVE
        },
        {
          name: 'name',
          required: true,
          type: vType.STRING,
          rule: validator.Rules.NAME
        },
        {
          name: 'parentId',
          required: (kind == 'insert'),
          type: vType.NUMERIC,
          min: 5
        }
      ]).exec();

    if (vRes.error) {
      return callback(vRes.error);
    }

    data = vRes.data;

    tr.series()
      .context(that)
      .then({fn: _checkExistence, args: [kind, data]})
      .then({fn: _checkParent, args: [kind, data]})
      .onError(callback)
      .exec(function() {
        callback(null, data);
      });

    function _checkExistence(cb, kind, data) {
      logger.debug('_checkExistence');
      if (kind != 'update') return cb.next();
      that.findById(data.id, 'id').exec(function(err, result) {
        if (result.length == 0) {
          cb.error('Group not found');
        } else {
          result = result[0];
          if (result.id < 5) {
            cb.error('Can not update system group');
          } else if (result.id == data.parentId) {
            cb.error('Group id and its parent id should not be same');
          } else {
            cb.next();
          }
        }
      }, cb.next);
    }

    function _checkParent(cb, kind, data) {
      logger.debug('_checkParent');

      if (!data.hasOwnProperty('parentId')) return cb.next();

      that.findById(data.parentId).exec(function(err, result) {
        if (result.length == 0) {
          cb.error('Invalid parent group Id');
        } else {
          result = result[0];
          data.nature = result.nature;
          data.level = result.level + 1;
          cb.next();
        }
      });
    }
  };

  this.deleteById = function(id, callback) {

    id = parseInt(id);

    this.find('COUNT(id) AS count').where('id=? OR parentId=?', [id, id]).exec(function(err, result) {

      if (result[0].count == 0) {
        return callback('Not Found');
      } else if (result[0].count > 1) {
        return callback('Group has some parent, can not be deleted');
      }

      _super.deleteById.call(this, id, function(err, result) {
        // err.code = ER_ROW_IS_REFERENCED_2
        if (err && err.errno == 1451) {
          callback('Group has some ledgers');
        } else {
          callback(err, result);
        }
      });

    }.bind(this), callback);

  };

  this.getTree = function(groupIds, callback) {

    this.db.query('SELECT id,name,parentId,nature,level FROM ledger_group ORDER BY `level` DESC,`index` ASC', function(err, result) {

      var groups
        , group
        , groupTree = []
        , row = 0
        , rowLength = result.length
        , level
        , grpIndex;

      while (row < rowLength) {

        group = result[row];
        level = group.level;
        groups = [];
        grpIndex = {};
        var i = 0;

        while (row < rowLength && level == group.level) {
          if (groupIds == null || groupIds.indexOf(group.id) != -1) {
            group.children = [];
            grpIndex[group.id] = i++;
            if (groupIds != null) {
              var pos = groupIds.indexOf(group.parentId);
              if (pos == -1) {
                groupIds.push(group.parentId);
              }
            }
            //pos = groupIds.indexOf(group.id);
            //groupIds.splice(pos, 1);
            delete group.level;
            groups.push(group);
          }
          if (row++ < rowLength) group = result[row];
        }

        var pid;
        groupTree.forEach(function(group) {
          if (grpIndex.hasOwnProperty(group.parentId)) {
            pid = group.parentId;
            delete group.parentId;
            groups[grpIndex[pid]].children.push(group);
          }
        });
        groupTree = groups;
      }
      callback(null, groups);
    });
  };

  this.arrange = function(data, callback) {

    var params = [];
    var sql = 'UPDATE ledger_group SET `index`=CASE id';
    data.forEach(function(t) {
      if (t.length == 2) {
        sql += ' WHEN ' + t[0] + ' THEN ' + t[1];
        params.push(t[0]);
      }
    });
    sql += ' END WHERE id IN(?)';

    this.db.query(sql, [params], callback);

  };

}

nodeUtil.inherits(LedgerGroup, Base);

exports.instance = function() {
  return new LedgerGroup();
};

exports.Nature = {
  ASSET: 1,
  LIABILITY: 2,
  INCOME: 3,
  EXPENSE: 4
};

exports.Types = {
  CASH: 1,
  BANK: 2,
  isCashOrBank: function(val) {
    return val == this.CASH || val == this.BANK;
  }
};

//var DB = require('./db');
//var lg = new LedgerGroup(new DB());

//lg.update({
//  name: 'one-updated'
//}, 'id=?', [49], function(err, result) {
//  console.log(err);
//  console.log(result);
//});

//lg.deleteById(49, function(err, result) {
//  console.log(err);
//  console.log(result);
//});

//var data = [
//  [1, 1],
//  [2, 2],
//  [3, 3],
//  [4, 4]
//];
//l.arrange(data, function(err, res) {
//  console.log(res);
//});

//var l = new LedgerGroup(new DB());
////[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//l.getTree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(err, tree) {
//  console.log(JSON.stringify(tree, null, 2));
//});



