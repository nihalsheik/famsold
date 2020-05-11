package com.nihalsoft.finam.api.models;

public enum GroupNature {

  ASSET(1),
  LIABILITY(2),
  INCOME(3),
  EXPENSE(4);

  int id = 0;

  GroupNature(int id) {
    this.id = id;
  }

  public int getId() {
    return this.id;
  }
}
