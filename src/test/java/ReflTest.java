import com.nihalsoft.finam.api.common.ReflectionUtil;
import com.nihalsoft.finam.api.common.Util;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.models.Unit;
import com.nihalsoft.finam.api.service.UnitService;
import com.nihalsoft.finam.api.validator.ValidationException;

import java.lang.reflect.Field;
import java.util.List;

public class ReflTest {

  public void test() {
    System.out.println(this.getClass().getSimpleName());
  }

  public static void main(String[] args)  {

    try {
      UnitService us = new UnitService();
      Unit u = new Unit();
      u.setName("");
      u.setDescription("Kilo Grams");
      u.setDecimalPlaces(2);
      us.insert(u);
      System.out.println("Done");
    } catch(ApiException ex) {
      System.out.println(ex.getMessage());
    }
  }
}
