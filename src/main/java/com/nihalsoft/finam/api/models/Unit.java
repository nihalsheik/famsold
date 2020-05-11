package com.nihalsoft.finam.api.models;

import com.nihalsoft.finam.api.annotation.Column;
import com.nihalsoft.finam.api.models.core.BaseModel;

public class Unit extends BaseModel {

  @Column
  private String name = "";

  @Column
  private String description = "";

  @Column
  private int decimalPlaces = 0;

  public String getName() {
    return name;
  }

  public Unit setName(String name) {
    this.name = name;
    return this;
  }

  public String getDescription() {
    return description;
  }

  public Unit setDescription(String description) {
    this.description = description;
    return this;
  }

  public int getDecimalPlaces() {
    return decimalPlaces;
  }

  public Unit setDecimalPlaces(int decimalPlaces) {
    this.decimalPlaces = decimalPlaces;
    return this;
  }

  @Override
  public String toString() {
    return this.name + "," + this.decimalPlaces;
  }

}
