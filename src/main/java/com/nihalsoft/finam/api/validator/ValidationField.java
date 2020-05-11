package com.nihalsoft.finam.api.validator;

public class ValidationField {

  private String name = "";
  private FieldType type = FieldType.STRING;
  private Object value = null;
  private boolean required = false;
  private ValidationRule rule = null;
  private int min = 0;
  private int max = 0;
  private String message = "";

  public enum FieldType {
    NUMERIC,
    STRING,
    DATE
  }

  public ValidationField() {

  }

  public ValidationField(String name, Object value, ValidationRule rule) {
    this(name, value, rule, false);
  }

  public ValidationField(String name, Object value, ValidationRule rule, boolean required) {
    this.name = name;
    this.value = value;
    this.required = required;
    this.setRule(rule);
  }

  public String getName() {
    return name;
  }

  public ValidationField setName(String name) {
    this.name = name;
    return this;
  }

  public FieldType getType() {
    return type;
  }

  public void setType(FieldType type) {
    this.type = type;
  }

  public Object getValue() {
    return value;
  }

  public ValidationField setValue(Object value) {
    this.value = value;
    return this;
  }

  public boolean isRequired() {
    return required;
  }

  public ValidationField setRequired(boolean required) {
    this.required = required;
    return this;
  }

  public ValidationRule getRule() {
    return rule;
  }

  public ValidationField setRule(ValidationRule rule) {
    if (rule == ValidationRule.NUMBER_POSITIVE) {
      this.setType(FieldType.NUMERIC);
    }
    this.rule = rule;
    return this;
  }

  public int getMin() {
    return min;
  }

  public ValidationField setMin(int min) {
    this.min = min;
    return this;
  }

  public int getMax() {
    return max;
  }

  public ValidationField setMax(int max) {
    this.max = max;
    return this;
  }

  public String getMessage() {
    return message;
  }

  public ValidationField setMessage(String message) {
    this.message = message;
    return this;
  }

}
