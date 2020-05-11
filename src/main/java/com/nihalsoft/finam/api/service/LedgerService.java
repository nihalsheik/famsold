package com.nihalsoft.finam.api.service;

import com.nihalsoft.finam.api.annotation.Table;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.models.Ledger;
import com.nihalsoft.finam.api.models.LedgerGroup;
import com.nihalsoft.finam.api.validator.ValidationException;
import com.nihalsoft.finam.api.validator.ValidationField;
import com.nihalsoft.finam.api.validator.ValidationRule;
import com.nihalsoft.finam.api.validator.Validator;
import org.apache.log4j.Logger;

import java.sql.ResultSet;
import java.sql.SQLException;

@Table(name = "ledger", model = Ledger.class)
public class LedgerService extends DataService<Ledger> {

  private final Logger log = Logger.getLogger("LedgerService");

  @Override
  public int insert(Ledger ledger) throws ApiException {
    this.validate(ledger, "insert");
    System.out.println(this.toJson(ledger));
    return super.insert(ledger, false);
  }

  @Override
  public int deleteById(int id) throws ApiException {
    try {
      super.deleteById(id);
    } catch (ApiException ex) {
      if (ex.getMessage().contains("voucher_ledger_ledgerId")) {
        throw new ApiException("Could not delete, It has some voucher items");
      }
    }
    return 0;
  }

  @Override
  public boolean validate(Ledger ledger, String action) throws ApiException {
    boolean req = action.equals("insert");
    Validator validator = new Validator();
    boolean vResult = validator
      .addField("id", ledger.getId(), req ? ValidationRule.ZERO : ValidationRule.NUMBER_POSITIVE)
      .addField("name", ledger.getName(), ValidationRule.ENTITY_NAME, req)
      .addField(
        new ValidationField("groupId", ledger.getGroupId(), ValidationRule.NUMBER_POSITIVE)
          .setRequired(true)
          .setMin(5)
      )
      .addField("debit", ledger.getDebit(), ValidationRule.NUMBER_POSITIVE)
      .addField("credit", ledger.getCredit(), ValidationRule.NUMBER_POSITIVE)
      .addField("address", ledger.getAddress(), ValidationRule.ANY_STRING)
      .validate();

    LedgerGroup lg = null;
    LedgerGroupService lgs = new LedgerGroupService();

    /**
     * Check ledger groupId
     */
    if (ledger.getGroupId() > 0) {

      lg = lgs.findById(ledger.getGroupId());
      if (lg == null) {
        log.error("Group not found");
        throw new ValidationException("Group not found");
      }
      ledger.setGroupNature(lg.getNature());
      ledger.setGroupType(lg.getType());
    }

    if (action.equals("update")) {
      lg = lgs.findById(ledger.getId());
      if (lg == null) {
        log.error("Ledger not found");
        throw new ValidationException("Ledger not found");
      }
    }

    return vResult;

  }

  @Override
  public void fill(Ledger ledger, ResultSet rs) throws SQLException {
    super.fill(ledger, rs);
    ledger.setName(rs.getString("name"));
    ledger.setAddress(rs.getString("address"));
    ledger.setGroupId(rs.getInt("groupId"));
    ledger.setGroupNature(rs.getInt("groupNature"));
    ledger.setGroupType(rs.getInt("groupType"));
    ledger.setDebit(rs.getInt("debit"));
    ledger.setCredit(rs.getInt("credit"));
  }

}
