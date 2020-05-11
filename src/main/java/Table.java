import java.lang.reflect.Array;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihalsoft.finam.api.models.Unit;
import com.nihalsoft.finam.api.service.UnitService;
import com.nihalsoft.finam.api.utils.ResultMap;

public class Table {

  private final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
  private final String DB_URL = "jdbc:mysql://localhost/ac";

  private static Logger log = Logger.getLogger("Test");

  @SuppressWarnings("unchecked")
  public void groupTree() throws Exception {

    Class.forName(JDBC_DRIVER);
    log.debug("Connecting to database...");
    Connection con = DriverManager.getConnection(DB_URL, "root", "welcome01");

    String sql = "SELECT id,name,parentId,nature,level FROM ledger_group ORDER BY `level` DESC,`index` ASC";
    Statement stmt = con.createStatement();
    ResultSet rst = stmt.executeQuery(sql);

    boolean hasRec = rst.next();

    List<Map<String, Object>> groupTree = new ArrayList<Map<String, Object>>();
    List<Map<String, Object>> groups = null;
    List<Integer> gi = null;

    while (hasRec) {

      int level = rst.getInt("level");
      groups = new ArrayList<Map<String, Object>>();
      gi = new ArrayList<Integer>();

      while (hasRec && level == rst.getInt("level")) {
        gi.add(rst.getInt("id"));
        groups.add(toMap(rst));
        hasRec = rst.next();
      }

      for (Map<String, Object> group : groupTree) {
        int pos = gi.indexOf(Integer.valueOf(group.get("parentId").toString()));
        if (pos != -1) {
          ((List<Map<String, Object>>) groups.get(pos).get("children")).add(group);
        }
      }

      groupTree = groups;
    }

    ObjectMapper om = new ObjectMapper();
    String json = om.writeValueAsString(groups);

    log.info(json);
    rst.close();
    stmt.close();
    con.close();

  }

  public static void main(String[] args) throws Exception {

    new Table().groupTree();

    // PreparedStatement ps = con.prepareStatement("SELECT * from
    // ledger_group
    // where id = ?");
    // ps.setObject(1, 1);
    // ResultSet rst = ps.executeQuery();
    // if (rst.next()) {
    // log.debug(rst.getString("name"));
    // }

    // try {
    // List<Unit> u = new
    // UnitService().getQuery().where("id=?").params(2).exec();
    // log.debug(u.toString());
    // } catch (InstantiationException | IllegalAccessException e) {
    // e.printStackTrace();
    // }
    //
    //// Unit u =
    // Query.instance(con).where("id=?").params(2).execOne(Unit.class);
    //// log.debug(u.toString());
    //
//    UnitService us = new UnitService();
//    try {
//      List<Unit> list = us.find();
//      log.debug(list.toString());
//    } catch (Exception e) {
//      // TODO Auto-generated catch block
//      e.printStackTrace();
//    }
    //
    // Unit u = new Unit();
    // u.setName("test");
    // u.setDescription("testshort");
    // us.insert(u);

    // LedgerGroupService lgs = new LedgerGroupService();
    // lgs.insert(null);

  }

  private Map<String, Object> toMap(ResultSet result) throws SQLException {
    Map<String, Object> map = new ResultMap(result, new String[]{"id", "name", "parentId"});
    map.put("children", new ArrayList<Map<String, Object>>());
    return map;
  }

}