import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.models.Ledger;
import com.nihalsoft.finam.api.service.LedgerService;

public class LedgerTest {

  public void insert() throws ApiException {
    Ledger ledger = new Ledger();
    ledger.setName("Sheik2");
    ledger.setGroupId(104);
    ledger.setDebit(100);
    LedgerService ls = new LedgerService();
    ls.insert(ledger);
  }

  public void update() throws ApiException {
    Ledger ledger = new Ledger();
    ledger.setId(100);
    ledger.setName("Sheik2-------------");
    LedgerService ls = new LedgerService();
    ls.updateById(ledger);
  }

  public void delete() throws ApiException {
    Ledger ledger = new Ledger();
    LedgerService lgs = new LedgerService();
    lgs.deleteById(3);
  }

  public static void main(String[] args) {
    try {
      new LedgerTest().delete();
    } catch (ApiException e) {
      e.printStackTrace();
    }
  }

}
