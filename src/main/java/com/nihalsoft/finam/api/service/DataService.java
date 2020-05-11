package com.nihalsoft.finam.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihalsoft.finam.api.annotation.Table;
import com.nihalsoft.finam.api.common.ReflectionUtil;
import com.nihalsoft.finam.api.common.Util;
import com.nihalsoft.finam.api.exception.ApiException;
import com.nihalsoft.finam.api.helper.Database;
import com.nihalsoft.finam.api.models.Query;
import com.nihalsoft.finam.api.validator.ValidationException;
import org.apache.log4j.Logger;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public abstract class DataService<E> implements IDataService<E> {

  private final Logger log = Logger.getLogger("DataService");

  private String tableName = "";
  private Class<?> model = null;

  public DataService() {
    if (this.getClass().isAnnotationPresent(Table.class)) {
      Table e = this.getClass().getAnnotation(Table.class);
      this.tableName = e.name();
      this.model = e.model();
    }
  }

  public String getTable() {
    return this.tableName;
  }


  public int insert(E model) throws ApiException {
    return this.insert(model, true);
  }

  public int insert(E model, boolean validate) throws ApiException {

    try {

      if (validate) {
        this.validate(model, "insert");
      }

      String sql = "";

      List<Field> fields = ReflectionUtil.getFields(model.getClass());
      List<Object> values = new ArrayList<>();

      String q = "";
      int i = 1;
      for (Field field : fields) {
        field.setAccessible(true);
        Object value = field.get(model);
        if (!Util.isEmpty(value)) {
          if (i++ > 1) {
            sql += ",";
            q += ",";
          }
          sql += "`" + field.getName() + "`";
          q += "?";
          values.add(value);
        }
      }

      if (values.size() == 0) {
        log.error("Nothing to insert");
        return -1;
      }

      sql = "INSERT INTO " + this.getTable() + "(" + sql + ") VALUES(" + q + ")";

      PreparedStatement pstmt = Database.intance().getConnection().prepareStatement(sql);
      i = 1;
      for (Object value : values) {
        pstmt.setObject(i++, value);
      }

      log.debug(sql);
      return pstmt.executeUpdate();

    } catch (ValidationException ex) {
      throw ex;

    } catch (SQLException ex) {
      throw new ApiException(ex.getMessage());

    } catch (Exception ex) {
      throw new ApiException("Unknown error");

    }
  }

  public int updateById(E model) throws ApiException {

    try {

      this.validate(model, "update");

      String sql = "";

      List<Field> fields = ReflectionUtil.getFields(model.getClass());
      List<Object> values = new ArrayList<>();

      int i = 1;
      for (Field field : fields) {
        //Column cols = field.getAnnotation(Column.class);
        field.setAccessible(true);
        Object value = field.get(model);
        if (!Util.isEmpty(value)) {
          sql += (i++ == 1 ? "`" : ",`") + field.getName() + "`=?";
          values.add(value);
        }
      }

      if (values.size() == 0) {
        log.error("Nothing to update");
        return -1;
      }

      sql = "UPDATE " + this.getTable() + " SET " + sql + " WHERE id=?";

      PreparedStatement pstmt = Database.intance().getConnection().prepareStatement(sql);
      i = 1;
      for (Object value : values) {
        pstmt.setObject(i++, value);
      }
      pstmt.setObject(i, 1);

      log.debug(sql);
      return pstmt.executeUpdate();

    } catch (ValidationException ex) {
      throw ex;

    } catch (SQLException ex) {
      throw new ApiException("err");

    } catch (Exception ex) {
      throw new ApiException("Unknown error");
    }

  }

  public int deleteById(int id) throws ApiException {

    Connection con = null;
    PreparedStatement pStmt = null;

    try {

      String sql = "DELETE FROM " + this.getTable() + " WHERE id=?";
      con = Database.intance().getConnection();
      pStmt = con.prepareStatement(sql);
      pStmt.setInt(1, id);
      log.debug(sql);
      int res = pStmt.executeUpdate();
      if (res == 0) {
        throw new ApiException("Not Found");
      }
      return res;

    } catch (SQLException ex) {
      log.debug("sql error");
      throw new ApiException(ex.getMessage());

    } catch (ClassNotFoundException ex) {
      throw new ApiException("Unknown error : " + ex.getMessage());

    } finally {
      log.debug("finally");
      Database.intance().close(con, pStmt);
    }

  }

  public Query getQuery() throws ApiException {
    return new Query().setFrom(this.getTable());
  }

  public List<E> find() throws ApiException {
    return new Query().setFrom(this.getTable()).exec(this);
  }

  public List<E> find(String where, Object[] params) throws ApiException {
    return new Query().setFrom(this.getTable()).setWhere(where).setParams(params).exec(this);
  }

  @SuppressWarnings("unchecked")
  public E newModel() throws InstantiationException, IllegalAccessException {
    log.debug("new instance");
    return (E) this.model.newInstance();
  }

  public E findOne(String where, Object[] params) throws ApiException {
    List<E> list = new Query().setFrom(this.getTable()).setWhere(where).setLimit(1).setParams(params).exec(this);
    if (list.size() > 0) {
      return list.get(0);
    } else {
      log.debug("Nothing");
      return null;
    }
  }

  public E findById(int id) throws ApiException {
    return this.findOne("id=?", new Object[]{id});
  }

  public boolean validate(E model, String action) throws ApiException {
    return true;
  }

  /**
   * @param BaseModel model
   * @param ResultSet resultSet
   * @throws SQLException
   */
  public void fill(E model, ResultSet resultSet) throws SQLException {
    // Do it on subclass.
  }

  public String toJson(E model) {
    String json = "";
    try {
      ObjectMapper om = new ObjectMapper();
      json = om.writeValueAsString(model);
    } catch (JsonProcessingException ex) {
      // Todo
    }
    return json;
  }
}