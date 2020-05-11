package com.nihalsoft.finam.api.utils;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;

public class ResultMap extends HashMap<String, Object> {

  private static final long serialVersionUID = 1L;

  public ResultMap() {
    super();
  }

  public ResultMap(int size) {
    super(size);
  }

  public ResultMap(ResultSet resultSet, String[] keys) throws SQLException {
    super();
    for (String key : keys) {
      put(key, resultSet.getObject(key));
    }
  }

  /**
   * @param ResultSet resultSet
   * @throws SQLException
   */
  public ResultMap(ResultSet resultSet) throws SQLException {
    super();
    ResultSetMetaData md = resultSet.getMetaData();
    int colLength = md.getColumnCount();
    for (int i = 1; i <= colLength; i++) {
      put(md.getColumnName(i), resultSet.getObject(i));
    }
  }

}
