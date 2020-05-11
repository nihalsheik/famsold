var data = [
  {ledgerId: 1, debit: 100, credit: 0},
  {ledgerId: 2, debit: 0, credit: 200},
  {ledgerId: 3, debit: 30, credit: 0},
  {ledgerId: 4, debit: 0, credit: 140},
  {ledgerId: 5, debit: 0, credit: 100},
  {ledgerId: 6, debit: 0, credit: 10},
  {ledgerId: 7, debit: 0, credit: 10},
  {ledgerId: 8, debit: 120, credit: 0}
];
updateAgainstLedgerId(data);

function updateAgainstLedgerId(data) {
  var isDebit
    , isCredit
    , spos = 0
    , did
    , cid;

  _init(0);

  data.forEach(function(v, index) {

    if ((isDebit && v.credit > 0) || (isCredit && v.debit > 0)) {
      if (isDebit) {
        cid = v.ledgerId;
      } else {
        did = v.ledgerId;
      }
      for (var i = spos; i <= index; i++) {
        data[i].againstLedgerId = (data[i].debit > 0) ? cid : did;
      }
      spos = index + 1;
      _init(spos);
    }
  });

  console.log(data);

  function _init(pos) {
    if (pos >= data.length) return;
    var v = data[pos];
    isDebit = v.debit > 0;
    isCredit = v.credit > 0;
    did = isDebit ? v.ledgerId : 0;
    cid = isCredit ? v.ledgerId : 0;
  }
}