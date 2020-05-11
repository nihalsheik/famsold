import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.models.Query;
import com.nihalsoft.finam.api.utils.ResultMap;

public class Test3 {

  public static void main(String[] args) throws ApiException, JsonProcessingException {

    //@formatter:off
    
    Map<Object, ResultMap> list = Query
        .instance()
        .setFrom("ledger")
        .setWhere("id IN (?,?,?)", new Integer[] { 1, 2, 3 })
        .execToKeyMap("id");

    //@formatter:on

    ObjectMapper om = new ObjectMapper();
    String json = om.writeValueAsString(list);
    System.out.println(json);

  }

}
