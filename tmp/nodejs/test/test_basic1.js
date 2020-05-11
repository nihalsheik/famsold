//argv = process.argv;
//if (argv.length < 3 || argv[2] != '--start') {
//  return;
//}

var tm = require('./tm');
var Voucher = require('../models/voucher');

var LEDGER = tm.LEDGER;

var vouchers = [
  {
    id1: LEDGER.CASH_AC.id,
    id2: LEDGER.CAPITAL.id,
    type: Voucher.Types.RECEIPT,
    amount: 100000,
    narration: 'Captial amount received'
  },
  {
    id1: LEDGER.PETTY_CASH.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT,
    amount: 10000,
    narration: 'Cash move to petty cash'
  },
  {
    id1: LEDGER.TABLE_AND_CHAIR.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT,
    amount: 2500,
    narration: 'Table and chair purchased'
  },
  {
    id1: LEDGER.UNION_BANK.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT,
    amount: 5000,
    narration: 'Deposit to union bank'
  },
  {
    id1: LEDGER.AMAN.id,
    id2: LEDGER.CASH_AC.id,
    type: Voucher.Types.PAYMENT,
    amount: 3000,
    narration: 'Debit to Aman'
  }
];

describe("Basic Test", function() {

  vouchers.forEach(function(voucher) {

    it(voucher.narration, function(next) {
      var data = {
        ref: '1',
        type: voucher.type,
        narration: voucher.narration,
        ledgers: [
          {
            ledgerId: voucher.id1,
            debit: voucher.amount,
            credit: 0
          },
          {
            ledgerId: voucher.id2,
            debit: 0,
            credit: voucher.amount
          }
        ]
      };
      //console.log(JSON.stringify(data, null, 2));
      tm
        .getRequest()
        .post('/voucher')
        .send(data)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            console.log(err);
          }
        });
      next();
    });
  });
});
