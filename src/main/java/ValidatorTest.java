import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihalsoft.finam.api.models.Unit;
import com.nihalsoft.finam.api.validator.ValidationException;
import com.nihalsoft.finam.api.validator.ValidationField;
import com.nihalsoft.finam.api.validator.ValidationRule;
import com.nihalsoft.finam.api.validator.Validator;

public class ValidatorTest {

  public static void main(String[] args) throws ValidationException, JsonProcessingException {

    Unit unit = new Unit();
    unit.setId(-1);
    unit.setName("adf");
    unit.setDecimalPlaces(2);

    try {

      Validator v = new Validator();
      v.addField(new ValidationField("name", unit.getName(), ValidationRule.ENTITY_NAME, true).setMessage("t1"));
      v.addField("description", unit.getDescription(), ValidationRule.ANY_STRING);
      v.addField(new ValidationField("decimalPlaces", unit.getDecimalPlaces(), ValidationRule.NUMBER_POSITIVE).setMax(2));
      v.validate();

      System.out.println("DONE");

    } catch (ValidationException ex) {
      ObjectMapper om = new ObjectMapper();
      String json = om.writeValueAsString(ex);
      System.out.println(json);
    }
  }

}
