package com.nihalsoft.finam.api.service;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.log4j.Logger;

import com.nihalsoft.finam.api.annotation.Table;
import com.nihalsoft.finam.api.models.Inventory;
import com.nihalsoft.finam.api.models.Unit;
import com.nihalsoft.finam.api.validator.ValidationException;

@Table(name = "unit", model = Unit.class)
public class InventoryService extends DataService<Inventory> {

  private final Logger log = Logger.getLogger("UnitService");

  @Override
  public boolean validate(Inventory inventory, String action) throws ValidationException {
    boolean req = action.equals("insert");

    // Validator validator = new Validator();
    // validator.addField("id", unit.getId(), ValidationRule.ZERO)
    // .addField("name", unit.getName(), ValidationRule.ENTITY_NAME, req)
    // .addField("description", unit.getDescription(),
    // ValidationRule.ANY_STRING)
    // .addField(new ValidationField("decimalPlaces", unit.getDecimalPlaces(),
    // ValidationRule.NUMBER_POSITIVE)
    // .setMax(5).setRequired(req));
    //
    // if (action.equals("update")) {
    // validator.getField(0).setRequired(true).setRule(ValidationRule.NUMBER_POSITIVE);
    // }

    // return validator.validate();
    return false;
  }

  public void fill(Inventory iv, ResultSet rs) throws SQLException {
    super.fill(iv, rs);
    iv.setId(rs.getInt("id"));
    iv.setName(rs.getString("name"));
    iv.setUnitId(rs.getInt("unitId"));
    iv.setDescription(rs.getString("description"));
  }

}
