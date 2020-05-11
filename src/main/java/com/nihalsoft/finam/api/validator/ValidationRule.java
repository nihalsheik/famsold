package com.nihalsoft.finam.api.validator;

import java.util.regex.Pattern;

public enum ValidationRule {

  NONE(""),

  ZERO("0"),

  ANY_STRING("^\\w+.*$"),

  ENTITY_NAME("^[a-zA-Z]\\w+.*$"),

  NUMBER_POSITIVE("^[+]?[0-9]+$");

  private String rule = "";

  ValidationRule(String rule) {
    this.rule = rule;
  }

  public boolean test(Object value) {
    return Pattern.matches(this.rule, "" + value);
  }
}
