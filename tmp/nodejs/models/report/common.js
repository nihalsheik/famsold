/**
 * Created by sheik on 19-12-2015.
 */

var db = require('../../models/db');

exports.getOpeningBalance = function(fromDate, callback) {

  var qry = 'SELECT l.name, SUM(debit) debit, SUM(credit) credit' +
    ' FROM voucher_item vi' +
    ' LEFT JOIN voucher v ON  vi.voucherId = v.id' +
    ' LEFT JOIN ledger l on l.id=1' +
    ' WHERE vi.ledgerId=1';

  if (fromDate != null) {
    qry += "OR v.createdAt<='" + fromDate + "'";
  }

  db.query(qry, function(err, result) {
    var r = {name: '', debit: 0, credit: 0};
    if (!err) {
      result = result[0];
      r.name = result.name;
      r.debit = result.debit || 0;
      r.credit = result.credit || 0;
    }
    callback.call(this, r)
  });

};

exports.getGroupTree = function(data, done) {

  var MAX_LEVEL = 3;

  //var qry = 'SELECT ledger.id, ledger.groupId,ledger.name, SUM(vi.debit) debit, SUM(vi.credit) credit' +
  //  ' FROM voucher_item AS vi' +
  //  ' LEFT OUTER JOIN ledger ON vi.ledgerId=ledger.id' +
  //  ' GROUP BY vi.ledgerId';
  //
  //db.query(qry, function(err, ledgers) {
  //  test(ledgers);
  //});

  var ledgers = data.ledgers;
  var ledIndex = {}, groupIds = [];
  if (ledgers != null) {
    ledgers.forEach(function(ledger, index) {
      if (!ledIndex.hasOwnProperty(ledger.groupId)) {
        ledIndex[ledger.groupId] = {ids: []};
      }
      ledIndex[ledger.groupId].ids.push(index);
      groupIds.push(ledger.groupId);
    });
  }

  (function iterateGroup(level, groupTree) {

    db.query("select id,name,parentId from ledger_group WHERE id IN (?) AND level=?", [groupIds, level], function(err, groups) {

      if (err) return done(err);

      var grpIndex = {};

      groups.forEach(function(group, i) {
        var credit = 0, debit = 0;
        if (ledIndex.hasOwnProperty(group.id)) {
          var leds = [];
          ledIndex[group.id].ids.forEach(function(pos) {
            var ledger = ledgers[pos];
            debit += ledger.debit;
            credit += ledger.credit;
            leds.push(ledger);
          });
          if (leds.length > 0) group.ledgers = leds;
        }
        group.debit = debit;
        group.credit = credit;
        group.children = [];
        grpIndex[group.id] = i;

        var pos = groupIds.indexOf(group.parentId);
        if (pos == -1) {
          groupIds.push(group.parentId);
        }
        pos = groupIds.indexOf(group.id);
        groupIds.splice(pos, 1);
      });

      groupTree.forEach(function(group) {
        if (grpIndex.hasOwnProperty(group.parentId)) {
          var pgroup = groups[grpIndex[group.parentId]];
          pgroup.debit += group.debit;
          pgroup.credit += group.credit;
          pgroup.children.push(group);
        }
      });

      groupTree = groups;

      if (--level > 0) iterateGroup(level, groupTree); else done(null, groupTree);

    });
  })(MAX_LEVEL, []);

}

exports.getGroupTree2 = function(data, done) {

  var MAX_LEVEL = 3;
  var groupIds = data.groupIds;

  (function iterateGroup(level, groupTree) {

    db.query("select id,name,parentId from ledger_group WHERE id IN (?) AND level=?", [groupIds, level], function(err, groups) {

      if (err) return done(err);

      var grpIndex = {};

      groups.forEach(function(group, i) {
        group.children = [];
        grpIndex[group.id] = i;
        var pos = groupIds.indexOf(group.parentId);
        if (pos == -1) {
          groupIds.push(group.parentId);
        }
        pos = groupIds.indexOf(group.id);
        groupIds.splice(pos, 1);
      });

      groupTree.forEach(function(group) {
        if (grpIndex.hasOwnProperty(group.parentId)) {
          var pgroup = groups[grpIndex[group.parentId]];
          pgroup.children.push(group);
        }
      });

      groupTree = groups;

      if (--level > 0) iterateGroup(level, groupTree); else done(null, groupTree);

    });
  })(MAX_LEVEL, []);

}

//exports.getGroupTree2({groupIds: [15, 16, 17]}, function(err, tree) {
//  parse(tree);
//  console.log(JSON.stringify(tree, null, 2));
//})