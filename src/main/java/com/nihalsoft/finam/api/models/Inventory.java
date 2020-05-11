package com.nihalsoft.finam.api.models;

import com.nihalsoft.finam.api.annotation.Column;
import com.nihalsoft.finam.api.models.core.BaseModel;

public class Inventory extends BaseModel {

  @Column
  private String name = "";

  @Column
  private int unitId = 0;

  @Column
  private String description = "";

  public String getName() {
    return name;
  }

  public Inventory setName(String name) {
    this.name = name;
    return this;
  }

  public int getUnitId() {
    return unitId;
  }

  public void setUnitId(int unitId) {
    this.unitId = unitId;
  }

  public String getDescription() {
    return description;
  }

  public Inventory setDescription(String description) {
    this.description = description;
    return this;
  }

  @Override
  public String toString() {
    return this.name + "," + this.unitId;
  }

}
