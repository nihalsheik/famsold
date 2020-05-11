package com.nihalsoft.finam.api.validator;

import com.nihalsoft.finam.api.exception.ApiException;

import java.util.ArrayList;
import java.util.List;

public class ValidationException extends ApiException {

  private static final long serialVersionUID = 1L;

  private List<ValidationField> fields = new ArrayList<ValidationField>();

  public ValidationException() {
    super();
  }

  public ValidationException(String message) {
    super(message);
  }

  public ValidationException addField(ValidationField field) {
    fields.add(field);
    return this;
  }

  public List<ValidationField> getFields() {
    return fields;
  }

  public void setFields(List<ValidationField> fields) {
    this.fields = fields;
  }

}
