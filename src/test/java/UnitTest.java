import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.models.Unit;
import com.nihalsoft.finam.api.service.UnitService;
import junit.framework.Assert;
import org.apache.log4j.Logger;
import org.junit.Test;

public class UnitTest {

  private final Logger log = Logger.getLogger("TestRunner");

  private ObjectMapper mapper;

  @Test()
  public void insert() throws JsonProcessingException {
    try {
      new UnitService()
        .insert(new Unit()
          .setName("Unit-" + String.valueOf(Math.random()))
          .setDecimalPlaces(2)
        );
      Assert.assertTrue(true);
    } catch (ApiException ex) {
      printError(ex);
    }
  }

  @Test()
  public void update() throws JsonProcessingException {
    try {
      Unit unit = new Unit();
      unit
        .setName("Unit-" + String.valueOf(Math.random()))
        .setDecimalPlaces(2)
        .setId(1);

      new UnitService().updateById(unit);
      Assert.assertTrue(true);
    } catch (ApiException ex) {
      printError(ex);
    }
  }

  @Test()
  public void delete() throws JsonProcessingException {
    try {
      new UnitService().deleteById(1);
      Assert.assertTrue(true);
    } catch (ApiException ex) {
      printError(ex);
    }
  }

  private void printError(Exception ex) throws JsonProcessingException {
    ObjectMapper om = new ObjectMapper();
    String json = om.writeValueAsString(ex);
    System.out.println(json);
    Assert.assertTrue(false);
  }

}
