package com.nihalsoft.finam.api.validator;

import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.List;

public class Validator {

  private final Logger log = Logger.getLogger("Validator");

  private List<ValidationField> fields = null;

  public Validator() {
    fields = new ArrayList<ValidationField>();
  }

  public Validator addField(String name, Object value, ValidationRule rule) {
    this.addField(name, value, rule, false);
    return this;
  }

  public Validator addField(String name, Object value, ValidationRule rule, boolean isRequired) {
    this.fields.add(new ValidationField(name, value, rule, isRequired));
    return this;
  }

  public Validator addField(ValidationField validationField) {
    this.fields.add(validationField);
    return this;
  }

  public Validator setFields(List<ValidationField> fields) {
    this.fields = fields;
    return this;
  }

  public ValidationField getField(int index) {
    return this.fields.get(index);
  }

  public boolean validate() throws ValidationException {

    boolean hasError = false;

    ValidationException ex = new ValidationException("Field Error");

    for (ValidationField vf : fields) {

      log.debug("---------------");
      log.debug("Validating field : " + vf.getName());

      boolean hasValue = false;

      switch (vf.getType()) {
        case STRING:
        case DATE:
          hasValue = vf.getValue() != null && vf.getValue().toString().matches(".*\\S+.*");
          break;
        case NUMERIC:
          hasValue = vf.getValue() != null || !vf.getValue().equals(0);
          break;
        default:
          break;
      }

      /**
       * Required field should not be empty value
       */

      if (!hasValue) {
        if (vf.isRequired()) {
          log.debug("Has Error");
          ex.addField(vf);
          hasError = true;
        }
        continue;
      }

      if (vf.getRule() != null) {
        log.debug("Checking rule");
        if (!vf.getRule().test(vf.getValue())) {
          log.debug("Has Error");
          ex.addField(vf);
          hasError = true;
          continue;
        }
      }

      switch (vf.getType()) {
        case NUMERIC:
          log.debug("Checking Numeric min and max");
          int v = Integer.parseInt(vf.getValue().toString());
          if (vf.getMax() > 0 && v > vf.getMax()) {
            vf.setMessage("Maximum exceed");
            ex.addField(vf);
            hasError = true;
          }
          break;
        case DATE:
          break;
        case STRING:
          break;
        default:
          break;
      }
    }

    if (hasError) {
      log.info("Throwing exception...");
      throw ex;
    } else {
      return hasError;
    }

  }

}
