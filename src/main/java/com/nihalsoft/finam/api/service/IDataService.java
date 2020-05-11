package com.nihalsoft.finam.api.service;

import java.sql.ResultSet;
import java.sql.SQLException;

public interface IDataService<E> {

  void fill(E model, ResultSet resultSet) throws SQLException;

  E newModel() throws InstantiationException, IllegalAccessException;

}
