package com.nihalsoft.finam.api.service;

import com.nihalsoft.finam.api.annotation.Table;
import com.nihalsoft.finam.api.models.Unit;
import com.nihalsoft.finam.api.validator.ValidationException;
import com.nihalsoft.finam.api.validator.ValidationField;
import com.nihalsoft.finam.api.validator.ValidationRule;
import com.nihalsoft.finam.api.validator.Validator;
import org.apache.log4j.Logger;

import java.sql.ResultSet;
import java.sql.SQLException;

@Table(name = "unit", model = Unit.class)
public class UnitService extends DataService<Unit> {

  private final Logger log = Logger.getLogger("UnitService");

  @Override
  public boolean validate(Unit unit, String action) throws ValidationException {
    boolean req = action.equals("insert");

    Validator validator = new Validator();
    validator
      .addField("id", unit.getId(), ValidationRule.ZERO)
      .addField("name", unit.getName(), ValidationRule.ENTITY_NAME, req)
      .addField("description", unit.getDescription(), ValidationRule.ANY_STRING)
      .addField(new ValidationField("decimalPlaces", unit.getDecimalPlaces(), ValidationRule.NUMBER_POSITIVE)
        .setMax(5)
        .setRequired(req)
      );

    if (action.equals("update")) {
      validator.getField(0).setRequired(true).setRule(ValidationRule.NUMBER_POSITIVE);
    }

    return validator.validate();
  }

  public void fill(Unit unit, ResultSet rs) throws SQLException {
    unit.setId(rs.getInt("id"));
    unit.setName(rs.getString("name"));
    unit.setDecimalPlaces(rs.getInt("decimalPlaces"));
  }

}
