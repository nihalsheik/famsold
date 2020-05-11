package com.nihalsoft.finam.api.service;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.log4j.Logger;

import com.nihalsoft.finam.api.annotation.Table;
import com.nihalsoft.finam.api.models.Voucher;
import com.nihalsoft.finam.api.models.VoucherItem;

@Table(name = "voucher_item", model = Voucher.class)
public class VoucherItemService extends DataService<VoucherItem> {

  private final Logger log = Logger.getLogger("VoucherService");

  @Override
  public VoucherItem newModel() {
    return new VoucherItem();
  }

  @Override
  public void fill(VoucherItem vi, ResultSet resultSet) throws SQLException {
    super.fill(vi, resultSet);
    vi.setId(resultSet.getInt("id"));
    vi.setDebit(resultSet.getInt("debit"));
    vi.setCredit(resultSet.getInt("credit"));
    vi.setLedgerId(resultSet.getInt("ledgerId"));
    vi.setNarration(resultSet.getString("narration"));
  }

}
