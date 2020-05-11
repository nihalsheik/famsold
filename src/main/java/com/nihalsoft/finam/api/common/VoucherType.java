package com.nihalsoft.finam.api.common;

public enum VoucherType {

  OPENING_BALANCE(1),

  CONTRA(2),

  PAYMENT(3),

  RECEIPT(4),

  JOURNAL(5),

  PURCHASE(6),

  PURCHASE_RETURN(7),

  SALES(8),

  SALES_RETURN(9);

  private int type = 0;

  VoucherType(int type) {
    this.type = type;
  }

}
