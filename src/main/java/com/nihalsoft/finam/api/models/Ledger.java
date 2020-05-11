package com.nihalsoft.finam.api.models;

import com.nihalsoft.finam.api.annotation.Column;
import com.nihalsoft.finam.api.models.core.BaseModel;

public class Ledger extends BaseModel {

  @Column
  private String name = "";
  @Column
  private int groupId = 0;
  @Column
  private int groupType = 0;
  @Column
  private int groupNature = 0;
  @Column
  private String address = "";
  @Column
  private int debit = 0;
  @Column
  private int credit = 0;


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getGroupId() {
    return groupId;
  }

  public void setGroupId(int groupId) {
    this.groupId = groupId;
  }

  public int getGroupType() {
    return groupType;
  }

  public void setGroupType(int groupType) {
    this.groupType = groupType;
  }

  public int getGroupNature() {
    return groupNature;
  }

  public void setGroupNature(int groupNature) {
    this.groupNature = groupNature;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
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
}
