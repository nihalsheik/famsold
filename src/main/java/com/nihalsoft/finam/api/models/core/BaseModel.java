package com.nihalsoft.finam.api.models.core;

import com.nihalsoft.finam.api.annotation.Column;

public abstract class BaseModel  {

  @Column
  private int id = 0;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

}
