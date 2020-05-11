import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihalsoft.finam.api.common.Util;
import com.nihalsoft.finam.api.common.VoucherType;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.models.Voucher;
import com.nihalsoft.finam.api.models.VoucherItem;
import com.nihalsoft.finam.api.service.VoucherService;

public class VoucherTest {

  public void insert() {
    try {
      Voucher v = new Voucher();
      v.setId(0);
      v.setRef("test");
      v.setVoucherType(VoucherType.JOURNAL);

      List<VoucherItem> lvi = new ArrayList<>();
      VoucherItem vi = new VoucherItem();
      vi.setId(0);
      vi.setDebit(0);
      vi.setCredit(100);
      vi.setLedgerId(2);
      lvi.add(vi);

      vi = new VoucherItem();
      vi.setId(0);
      vi.setDebit(100);
      vi.setCredit(0);
      vi.setLedgerId(3);
      lvi.add(vi);
      
      v.setVoucherItems(lvi);

      VoucherService vs = new VoucherService();
      vs.insert(v);
    } catch (Exception ex) {
      System.out.println(Util.toJson(ex));
    }
  }
  
  public void getVoucher(int id) {
    try {
      VoucherService vs = new VoucherService();
      Voucher v = vs.getVoucher(id);
      System.out.println(Util.toJson(v, true));
    } catch (ApiException e) {
      e.printStackTrace();
    }
  }
  
  public static void main(String[] args) throws JsonProcessingException {
    new VoucherTest().insert();

  }

}
