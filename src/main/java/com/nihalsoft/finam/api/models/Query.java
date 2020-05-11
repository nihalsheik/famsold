package com.nihalsoft.finam.api.models;

import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.helper.Database;
import com.nihalsoft.finam.api.service.IDataService;
import com.nihalsoft.finam.api.utils.ResultMap;
import org.apache.log4j.Logger;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Query {

  private final Logger log = Logger.getLogger("Query");

  private String from = "";
  private String fields = "*";
  private String where = "";
  private int skip = 0;
  private int limit = 0;
  private String orderBy = "";
  private Object[] params = null;
  private ResultSet currentResult = null;

  public Query() {
  }

  public static Query instance() {
    return new Query();
  }

  public Query setFrom(String from) {
    this.from = from;
    return this;
  }

  public Query setFields(String fields) {
    this.fields = fields;
    return this;
  }

  public Query setWhere(String where) {
    this.where = where;
    return this;
  }

  public Query setWhere(String where, Object[] params) {
    this.where = where;
    this.params = params;
    return this;
  }
  
  public Query setParams(Object[] params) {
    this.params = params;
    return this;
  }

  public Query setLimit(int limit) {
    this.limit = limit;
    return this;
  }

  public Query setLimit(int skip, int limit) {
    this.skip = skip;
    this.limit = limit;
    return this;
  }

  public Query setOrderBy(String orderBy) {
    this.orderBy = orderBy;
    return this;
  }

  public Query exec(Connection connection) throws ApiException {

    log.debug("Exec");

    PreparedStatement pStmt = null;

    try {
      String sql = this.toSql();

      if (connection == null) {
        throw new ApiException("There is not database connection");
      }

      pStmt = connection.prepareStatement(sql);
      pStmt.closeOnCompletion();

      if (params != null) {
        int i = 1;
        for (Object parameter : params) {
          pStmt.setObject(i++, parameter);
        }
      }
      currentResult = pStmt.executeQuery();

    } catch (SQLException ex) {
      throw new ApiException(ex.getMessage());

    }

    return this;

  }

  public Map<Object, ResultMap> _toResultMapWithKey(ResultSet resultSet, String key) {
    Map<Object, ResultMap> list = new HashMap<>();
    try {
      ResultSetMetaData md = resultSet.getMetaData();
      int colLength = md.getColumnCount();
      String[] colNames = new String[colLength];
      for (int i = 0; i < colLength; i++) {
        colNames[i] = md.getColumnName(i + 1);
      }
      while (resultSet.next()) {
        list.put(resultSet.getObject(key), new ResultMap(resultSet, colNames));
      }
    } catch (Exception ex) {
      // Todo
    }
    return list;
  }

  public List<ResultMap> _toResultMap(ResultSet resultSet) {
    List<ResultMap> list = new ArrayList<>();
    try {
      ResultSetMetaData md = resultSet.getMetaData();
      int colLength = md.getColumnCount();
      String[] colNames = new String[colLength];
      for (int i = 0; i < colLength; i++) {
        colNames[i] = md.getColumnName(i + 1);
      }
      while (resultSet.next()) {
        list.add(new ResultMap(resultSet, colNames));
      }
    } catch (Exception ex) {
      log.error("Error : " + ex.getMessage());
      // Todo
    }
    return list;
  }

  public ResultSet toResultSet() {
    return currentResult;
  }

  @SuppressWarnings("unchecked")
  public Map<Object, ResultMap> execToKeyMap(String key) throws ApiException {
    return (Map<Object, ResultMap>) this._executeQuery(2, key);
  }

  // ----------------------------------------------------------------------------------------------------//
  /**
   * @return
   * @throws ApiException
   */
  @SuppressWarnings("unchecked")
  public List<ResultMap> execToMap() throws ApiException {
    return (List<ResultMap>) this._executeQuery(1, "");
  }

  // ----------------------------------------------------------------------------------------------------//
  /**
   * @param dataService
   * @return
   * @throws ApiException
   */
  public <T> List<T> exec(IDataService<T> dataService) throws ApiException {

    log.debug("Exec");

    List<T> results = null;
    Connection connection = null;
    PreparedStatement pStmt = null;
    ResultSet rs = null;

    try {
      String sql = this.toSql();
      results = new ArrayList<T>();

      connection = Database.intance().getConnection();
      pStmt = connection.prepareStatement(sql);

      if (params != null) {
        int i = 1;
        for (Object parameter : params) {
          pStmt.setObject(i++, parameter);
        }
      }

      rs = pStmt.executeQuery();
      log.debug("in loop1");

      T model = null;
      while (rs.next()) {
        log.debug("in loop");
        model = dataService.newModel();
        dataService.fill(model, rs);
        results.add(model);
      }

    } catch (SQLException ex) {
      ex.printStackTrace();
      throw new ApiException(ex.getMessage());

    } catch (Exception ex) {
      log.debug(ex.getMessage());
      throw new ApiException(ex.getMessage());

    } finally {
      Database.intance().close(connection, pStmt, rs);
    }
    return (List<T>) results;

  }

  // ----------------------------------------------------------------------------------------------------//
  private Object _executeQuery(int flag, String key) throws ApiException {

    log.debug("_executeQuery");

    Connection connection = null;
    PreparedStatement pStmt = null;
    ResultSet rs = null;
    Object result = null;

    try {
      String sql = this.toSql();
      connection = Database.intance().getConnection();
      pStmt = connection.prepareStatement(sql);

      if (params != null) {
        int i = 1;
        for (Object parameter : params) {
          pStmt.setObject(i++, parameter);
        }
      }

      rs = pStmt.executeQuery();

      switch (flag) {
      case 1:
        result = _toResultMap(rs);
        break;
      case 2:
        result = _toResultMapWithKey(rs, key);
        break;
      case 3:
        break;
      }

    } catch (SQLException ex) {
      ex.printStackTrace();
      throw new ApiException(ex.getMessage());

    } catch (Exception ex) {
      log.debug(ex.getMessage());
      throw new ApiException(ex.getMessage());

    } finally {
      log.debug("Completed");
      Database.intance().close(connection, pStmt, rs);
    }
    return result;
  }

  // ----------------------------------------------------------------------------------------------------//
  /**
   * @return String
   */
  public String toSql() {
    String sql = "SELECT " + fields + " FROM " + from;

    if (!where.equals("")) {
      sql += " WHERE " + where;
    }

    if (!orderBy.equals("")) {
      sql += " ORDER BY  " + orderBy;
    }

    if (limit > 0) {
      sql += " LIMIT " + String.valueOf(skip) + "," + String.valueOf(limit);
    }

    log.debug(sql);
    return sql;
  }

}
