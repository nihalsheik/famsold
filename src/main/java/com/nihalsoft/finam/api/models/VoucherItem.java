package com.nihalsoft.finam.api.models;

import com.nihalsoft.finam.api.models.core.BaseModel;

public class VoucherItem extends BaseModel {

  private int ledgerId = 0;
  private int againstLedgerId = 0;
  private int debit = 0;
  private int credit = 0;
  private String narration = "";

  public int getLedgerId() {
    return ledgerId;
  }

  public void setLedgerId(int ledgerId) {
    this.ledgerId = ledgerId;
  }

  public int getAgainstLedgerId() {
    return againstLedgerId;
  }

  public void setAgainstLedgerId(int againstLedgerId) {
    this.againstLedgerId = againstLedgerId;
  }

  public int getDebit() {
    return debit;
  }

  public void setDebit(int debit) {
    this.debit = debit;
  }

  public int getCredit() {
    return credit;
  }

  public void setCredit(int credit) {
    this.credit = credit;
  }

  public String getNarration() {
    return narration;
  }

  public void setNarration(String narration) {
    this.narration = narration;
  }

}
