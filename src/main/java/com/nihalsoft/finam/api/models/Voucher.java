package com.nihalsoft.finam.api.models;

import java.util.List;

import com.nihalsoft.finam.api.common.VoucherType;

public class Voucher {

  private int id = 0;
  private String date = "";
  private String ref = "";
  private String narration = "";
  private VoucherType voucherType;
  private List<VoucherItem> voucherItems;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public String getRef() {
    return ref;
  }

  public void setRef(String ref) {
    this.ref = ref;
  }

  public String getNarration() {
    return narration;
  }

  public void setNarration(String narration) {
    this.narration = narration;
  }

  public VoucherType getVoucherType() {
    return voucherType;
  }

  public void setVoucherType(VoucherType voucherType) {
    this.voucherType = voucherType;
  }

  public List<VoucherItem> getVoucherItems() {
    return voucherItems;
  }

  public void setVoucherItems(List<VoucherItem> voucherItems) {
    this.voucherItems = voucherItems;
  }

}
