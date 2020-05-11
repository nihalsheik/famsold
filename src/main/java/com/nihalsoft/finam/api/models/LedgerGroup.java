package com.nihalsoft.finam.api.models;

import com.nihalsoft.finam.api.annotation.Column;
import com.nihalsoft.finam.api.models.core.BaseModel;

public class LedgerGroup extends BaseModel {

  @Column
  private String name = "";
  @Column
  private int parentId = 0;
  @Column
  private int nature = 0;
  @Column
  private int level = 0;
  @Column
  private int type = 0;


  public String getName() {
    return name;
  }

  public LedgerGroup setName(String name) {
    this.name = name;
    return this;
  }

  public int getParentId() {
    return parentId;
  }

  public LedgerGroup setParentId(int parentId) {
    this.parentId = parentId;
    return this;
  }

  public int getNature() {
    return nature;
  }

  public LedgerGroup setNature(int nature) {
    this.nature = nature;
    return this;
  }

  public int getLevel() {
    return level;
  }

  public LedgerGroup setLevel(int level) {
    this.level = level;
    return this;
  }

  public int getType() {
    return type;
  }

  public LedgerGroup setType(int type) {
    this.type = type;
    return this;
  }

  @Override
  public String toString() {
    return this.getId() + "," + this.name + "," + this.parentId;
  }
}
