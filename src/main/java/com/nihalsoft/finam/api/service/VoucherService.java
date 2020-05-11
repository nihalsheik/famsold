package com.nihalsoft.finam.api.service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.nihalsoft.finam.api.annotation.Table;
import com.nihalsoft.finam.api.common.Util;
import com.nihalsoft.finam.api.common.VoucherType;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.models.Query;
import com.nihalsoft.finam.api.models.Voucher;
import com.nihalsoft.finam.api.models.VoucherItem;
import com.nihalsoft.finam.api.utils.ResultMap;

@Table(name = "voucher", model = Voucher.class)
public class VoucherService extends DataService<Voucher> {

  private final Logger log = Logger.getLogger("VoucherService");

  // ----------------------------------------------------------------------------------------------------//
  @Override
  public int insert(Voucher voucher) throws ApiException {

    List<VoucherItem> voucherItems = voucher.getVoucherItems();
    List<Integer> uniqueLids = new ArrayList<Integer>();
    List<Integer> uniqueVids = new ArrayList<Integer>();

    ApiException apiExp = null;

    int debit = 0, credit = 0;

    for (VoucherItem vi : voucherItems) {

      String err = "";

      if (vi.getId() < 0) {
        err = "Invalid voucher item id";

      } else if (vi.getLedgerId() < 0) {
        err = "Invalid ledger id";

      } else if (vi.getDebit() < 0) {
        err = "Invalid debit amount";

      } else if (vi.getDebit() < 0) {
        err = "Invalid credit amount";

      } else if (vi.getDebit() > 0 && vi.getCredit() > 0) {
        err = "Debit & Credit should not be value";

      } else if (vi.getDebit() == 0 && vi.getCredit() == 0) {
        err = "Empty debit and credit";

      } else if (uniqueVids.contains(vi.getId())) {
        err = "Duplicate voucher item id";

      }

      if (!err.equals("")) {
        ResultMap resultMap = new ResultMap();
        resultMap.put("ledger", vi);
        apiExp = new ApiException(err);
        apiExp.getDetail().add(resultMap);
        break;
      }

      if (!uniqueLids.contains(vi.getLedgerId())) {
        uniqueLids.add(vi.getLedgerId());
      }

      if (vi.getId() > 0 && !uniqueVids.contains(vi.getId())) {
        uniqueVids.add(vi.getId());
      }

      debit += vi.getDebit();
      credit += vi.getCredit();
    }

    if (apiExp != null) {
      throw apiExp;

    } else if (uniqueLids.size() < 2) {
      throw new ApiException("It should be two entry. Some ledger ids are unique.");

    } else if (!voucher.getVoucherType().equals(VoucherType.JOURNAL)) {

      //@Fixme voucher type.
      
      throw new ApiException("It should be two entry. Some ledger ids are unique.");

    } else if (debit != credit) {
      /**
       * type=1 opening balance does not need to have balanced one.
       */
      throw new ApiException("Unbalanced Voucher");
    }

    this._validateLedgers(uniqueLids);
    this._validateVouchers(voucher.getId(), uniqueVids);
    this._updateAgnstLedger(voucher);

    // @Cleanup
    uniqueLids = null;
    uniqueVids = null;

    return 0;
  }

  // ----------------------------------------------------------------------------------------------------//

  private void _validateLedgers(List<Integer> uniqueLids) throws ApiException {

    String q = StringUtils.repeat("?,", uniqueLids.size());
    q = q.substring(0, q.length() - 1);

    log.debug(q);

    //@formatter:off
    
    Map<Object, ResultMap> list = Query
        .instance()
        .setFields("id,groupId")
        .setFrom("ledger")
        .setWhere("id IN ("+q+")", uniqueLids.toArray())
        .execToKeyMap("id");

    //@formatter:on

    log.debug(Util.toJson(list));

    List<Integer> v = new ArrayList<>();
    for (int uid : uniqueLids) {
      if (!list.containsKey(uid)) {
        v.add(uid);
      }
    }

    if (v.size() > 0) {
      throw new ApiException("Invalid ledger found [" + StringUtils.join(v, ',') + "]");
    }

  }

  // ----------------------------------------------------------------------------------------------------//

  private void _validateVouchers(int voucherId, List<Integer> uniqueVids) throws ApiException {

    log.debug("_validateVouchers");
    //@formatter:off
    
    Map<Object, ResultMap> list = Query
        .instance()
        .setFields("id")
        .setFrom("voucher_item")
        .setWhere("voucherId=?", new Integer[]{voucherId})
        .execToKeyMap("id");

    //@formatter:on

    List<Integer> v = new ArrayList<>();
    for (int vid : uniqueVids) {
      if (!list.containsKey(vid)) {
        v.add(vid);
      }
    }

    if (v.size() > 0) {
      throw new ApiException("Invalid voucher item id found [" + StringUtils.join(v, ',') + "]");
    }

  }

  private void _updateAgnstLedger(Voucher voucher) {

    log.debug("_updateAgnstLedger");

    List<VoucherItem> voucherItems = voucher.getVoucherItems();

    if (voucher.getVoucherType() != VoucherType.JOURNAL) {

      log.debug("Against Ledger : not journal");

      switch (voucher.getVoucherType()) {
      default:
        voucherItems.get(0).setAgainstLedgerId(voucherItems.get(1).getLedgerId());
        voucherItems.get(1).setAgainstLedgerId(voucherItems.get(0).getLedgerId());
      }
      return;
    }

    boolean isDebit, isCredit;
    int spos = 0, did, cid;
    int index = 0;
    VoucherItem vi2 = null;

    while (index < voucherItems.size()) {

      VoucherItem vi = voucherItems.get(index);
      isDebit = vi.getDebit() > 0;
      isCredit = vi.getCredit() > 0;
      did = isDebit ? vi.getLedgerId() : 0;
      cid = isCredit ? vi.getLedgerId() : 0;

      while (index < voucherItems.size()) {

        vi = voucherItems.get(index);

        if ((isDebit && vi.getCredit() > 0) || (isCredit && vi.getDebit() > 0)) {
          if (isDebit) {
            cid = vi.getLedgerId();
          } else {
            did = vi.getLedgerId();
          }
          for (int i = spos; i <= index; i++) {
            vi2 = voucherItems.get(i);
            vi2.setAgainstLedgerId(vi2.getDebit() > 0 ? cid : did);
          }
          spos = index + 1;
          index++; /// Need to check here
          break;
        }
        index++;
      }

    }

    log.debug(Util.toJson(voucher, true));
  }

  // ----------------------------------------------------------------------------------------------------//

  @Override
  public Voucher newModel() {
    return new Voucher();
  }

  @Override
  public void fill(Voucher voucher, ResultSet resultSet) throws SQLException {
    super.fill(voucher, resultSet);
    voucher.setId(resultSet.getInt("id"));
    voucher.setRef(resultSet.getString("ref"));
    voucher.setDate(resultSet.getString("createdAt"));
    voucher.setNarration(resultSet.getString("narration"));
  }

  public Voucher getVoucher(int id) throws ApiException {

    log.debug("_validateVouchers");

    Voucher voucher = this.findById(id);
    if (voucher == null) {
      return null;
    }
    List<VoucherItem> lv = new VoucherItemService().find("voucherId=?", new Integer[] { id });
    voucher.setVoucherItems(lv);

    return voucher;
  }
}
