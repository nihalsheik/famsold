import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihalsoft.finam.api.common.Util;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.models.LedgerGroup;
import com.nihalsoft.finam.api.service.LedgerGroupService;
import com.nihalsoft.finam.api.utils.ResultMap;

import java.util.List;
import java.util.Map;

public class LedgerGroupTest {

  public void test1() {
    try {
      LedgerGroupService lgs = new LedgerGroupService();
      LedgerGroup lg = lgs.findById(1);
      System.out.println(lg.getName());
    } catch (ApiException ex) {
      System.out.println(ex.getMessage());

    }
  }

  public void test2() {
    try {

      LedgerGroupService lgs = new LedgerGroupService();
      List<LedgerGroup> list = lgs.find("id=?", new Object[]{1});

      for (LedgerGroup lg : list) {
        System.out.println(lg.getName());
      }

    } catch (ApiException ex) {
      System.out.println(ex.getMessage());

    }

  }

  public void delete() {
    try {
      LedgerGroupService lgs = new LedgerGroupService();
      lgs.deleteById(12333);
    } catch (ApiException ex) {
      System.out.println(ex.getMessage());

    }
  }

  public void getTree() {
    try {
      LedgerGroupService lgs = new LedgerGroupService();
      List<ResultMap> res = lgs.getTree();
      System.out.println(Util.toJson(res, true));

    } catch (Exception ex) {
      System.out.println(ex.getMessage());

    }
  }


  public static void main(String[] args) {
    new LedgerGroupTest().getTree();
  }


}
