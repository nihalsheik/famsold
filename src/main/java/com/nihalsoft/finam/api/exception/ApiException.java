package com.nihalsoft.finam.api.exception;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nihalsoft.finam.api.utils.ResultMap;

import java.util.ArrayList;
import java.util.List;

public class ApiException extends Exception {

  private List<ResultMap> detail = new ArrayList<>();
  
  @JsonIgnore
  private String[] suppressed;

  public ApiException() {
    super();
  }

  public ApiException(String message) {
    super(message);
  }

  public List<ResultMap> getDetail() {
    return detail;
  }

  public void setDetail(List<ResultMap> detail) {
    this.detail = detail;
  }
  
  @JsonIgnore
  @Override
  public StackTraceElement[] getStackTrace() {
    return super.getStackTrace();
  }
  
  @JsonIgnore
  @Override
  public String getLocalizedMessage() {
    return super.getLocalizedMessage();
  }
}