package com.nihalsoft.finam.api.models.core;

import java.awt.Cursor;
import java.util.List;

public class ActiveDAO<E> {

  public static String TAG = ActiveDAO.class.getName();


  public ActiveDAO() {
  }

  public ActiveDAO(Class<E> clazz) {
  }

  @SuppressWarnings("unchecked")
  public <T> T getCursorData(Cursor cursor, String name, Class<T> data) {
    return null;
    // return (T) cursor.getString(columnIndex);
  }

  public List<E> getAll() {
    return null;
  }

  // public <T extends IModel> List<T> parseFromJson(String source, Class<T>
  // clazz) {
  // ObjectMapper mapper = new ObjectMapper();
  // mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
  // List<T> result = null;
  // try {
  // result = mapper.readValue(source,
  // mapper.getTypeFactory().constructCollectionType(List.class, clazz));
  // } catch (Exception e) {
  // e.printStackTrace();
  // }
  // return result;
  // }

}
