package com.nihalsoft.finam.api.service;

import com.nihalsoft.finam.api.annotation.Table;
import com.nihalsoft.finam.api.common.Util;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.helper.Database;
import com.nihalsoft.finam.api.models.LedgerGroup;
import com.nihalsoft.finam.api.utils.ResultMap;
import com.nihalsoft.finam.api.validator.ValidationException;
import com.nihalsoft.finam.api.validator.ValidationRule;
import com.nihalsoft.finam.api.validator.Validator;
import org.apache.log4j.Logger;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Table(name = "ledger_group", model = LedgerGroup.class)
public class LedgerGroupService extends DataService<LedgerGroup> {

  private final Logger log = Logger.getLogger("LedgerGroupService");

  /**
   * @param ledgerGroup
   *          This is Model
   * @param action
   *          insert or update
   * @return boolean
   * @throws ValidationException
   */
  @Override
  public boolean validate(LedgerGroup ledgerGroup, String action) throws ValidationException, ApiException {
    super.validate(ledgerGroup, action);

    boolean req = action.equals("insert");

    log.debug("Validating...");

    Validator validator = new Validator();
    validator.addField("id", ledgerGroup.getId(), req ? ValidationRule.ZERO : ValidationRule.NUMBER_POSITIVE)
        .addField("name", ledgerGroup.getName(), ValidationRule.ENTITY_NAME, req)
        .addField("parentId", ledgerGroup.getParentId(), ValidationRule.NUMBER_POSITIVE).validate();

    log.debug("Finish");

    if (action.equals("update")) {

      log.debug("For update");

      if (ledgerGroup.getId() == ledgerGroup.getParentId()) {
        log.debug("id = parentId");
        throw new ValidationException("Group id and its parent id should not be same");

      } else if (ledgerGroup.getId() < 5) {
        log.debug("id < 5");
        throw new ValidationException("Can not update system group");
      }

      LedgerGroup lg = this.findById(ledgerGroup.getId());
      if (lg == null) {
        log.error("Group not found");
        throw new ValidationException("Group not found");
      }

    }
    LedgerGroup lg = this.findById(ledgerGroup.getParentId());
    if (lg == null) {
      log.error("Invalid parent id");
      throw new ValidationException("Invalid parent id");
    }

    ledgerGroup.setName(lg.getName());
    ledgerGroup.setLevel(lg.getLevel() + 1);

    return true;
  }

  @Override
  public void fill(LedgerGroup model, ResultSet rs) throws SQLException {
    super.fill(model, rs);
    model.setId(rs.getInt("id"));
    model.setName(rs.getString("name"));
    model.setParentId(rs.getInt("parentId"));
    model.setType(rs.getInt("type"));
    model.setNature(rs.getInt("nature"));
    model.setLevel(rs.getInt("level"));
  }

  @Override
  public int deleteById(int id) throws ApiException {
    try {
      super.deleteById(id);
    } catch (ApiException ex) {
      if (ex.getMessage().contains("fk_ledger_group_parent")) {
        throw new ApiException("Could not delete, It has some children");
      }
    }
    return 0;
  }

  public List<ResultMap> getTree() throws ApiException {

    List<ResultMap> groups = null;
    Connection con = null;
    ResultSet rs = null;

    try {

      //@formatter:off
      List<ResultMap> tree = this.getQuery()
          .setFields("id,name,parentId,nature,level")
          .setOrderBy("`level` DESC,`index` ASC")
          .execToMap();
      //@formatter:on

      Iterator<ResultMap> it = tree.iterator();

      List<ResultMap> groupTree = new ArrayList<>();
      List<Integer> gi = null;
      boolean hasRec = it.hasNext();
      ResultMap rm = it.next();

      while (hasRec) {

        int level = (int) rm.get("level");
        groups = new ArrayList<>();
        gi = new ArrayList<>();

        while (hasRec && level == (int) rm.get("level")) {
          gi.add((int) rm.get("id"));
          rm.remove("level");
          rm.remove("nature");
          groups.add(rm);
          hasRec = it.hasNext();
          if (hasRec) {
            rm = it.next();
          }
        }
        for (ResultMap group : groupTree) {
          int pos = gi.indexOf(Integer.valueOf(group.get("parentId").toString()));
          if (pos != -1) {
            ResultMap rm2 = groups.get(pos);
            if (!rm2.containsKey("children")) {
              rm2.put("children", new ArrayList<ResultMap>());
            }
            ((List<ResultMap>) rm2.get("children")).add(group);
          }
          group.remove("parentId");
        }
        groupTree = groups;

      }

      if (groups != null) {
        for (Map<String, Object> group : groups) {
          group.remove("parentId");
        }
      }

    } catch (Exception ex) {
      ex.printStackTrace();
      System.out.println(ex.getMessage());
      // Todo
    } finally {
      Database.intance().close(con, null, rs);
    }

    return groups;

  }

}
