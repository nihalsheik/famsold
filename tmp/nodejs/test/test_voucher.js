argv = process.argv;
if (argv.length < 3 || argv[2] != '--start') {
  return;
}

var tm = require('./tm');
var Voucher = require('../models/voucher');

var LEDGER = tm.LEDGER;

var vouchers = [
  {
    id1: LEDGER.FOOD_EXPENSE.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT
  },
  {
    id1: LEDGER.TABLE_AND_CHAIR.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT
  },
  {
    id1: LEDGER.PURCHASE.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PURCHASE
  },
  {
    id1: LEDGER.CASH_AC.id,
    id2: LEDGER.SALES.id,
    type: Voucher.Types.SALES
  },
  {
    id1: LEDGER.CASH_AC.id,
    id2: LEDGER.SALARY.id,
    type: Voucher.Types.PAYMENT
  },
  {
    id1: LEDGER.TRAVEL_EXPENSE.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT
  },
  {
    id1: LEDGER.AMAN.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT
  },
  {
    id1: LEDGER.SHARES.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT
  },
  {
    id1: LEDGER.UNION_BANK.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT
  },
  {
    id1: LEDGER.CASH_AC.id,
    id2: LEDGER.KUMAR.id,
    type: Voucher.Types.RECEIPT
  },
  {
    id1: LEDGER.PURCHASE.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PURCHASE
  },
  {
    id1: LEDGER.CASH_AC.id,
    id2: LEDGER.SALES.id,
    type: Voucher.Types.SALES,
    amount: 50000
  }
];

var day = 24 * 60 * 60 * 1000;

function _do() {
  var pos = Math.floor(Math.random() * vouchers.length);

  var voucher = vouchers[pos];

  var amount = voucher.amount || Math.round(Math.random() * 1000);

  var t = Date.now() - Math.floor(Math.random() * 10) * day;
  t = new Date(t).toISOString().replace(/T/, ' ').replace(/\..+/, '');

  var data = {
    ref: '1',
    type: voucher.type,
    narration: 'test',
    createdAt:t,
    ledgers: [
      {
        ledgerId: voucher.id1,
        debit: amount,
        credit: 0
      },
      {
        ledgerId: voucher.id2,
        debit: 0,
        credit: amount
      }
    ]
  };

  console.log(JSON.stringify(data, null, 2));

  tm.getRequest()
    .post("/voucher")
    .send(data)
    .expect(200)
    .end(function(err, res) {
      console.log('-----------------------------------------------');
      console.log(res.body);
      if (err) {
        console.log(err);
      }
      setTimeout(_do, 1000);
    });

}

_do();