package com.nihalsoft.finam.api.helper;

import java.sql.*;

import org.apache.log4j.Logger;

public class Database {

  final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
  final String DB_URL = "jdbc:mysql://localhost/ac";

  private static Database _instance = null;

  private final Logger log = Logger.getLogger("Database");

  public static Database intance() {
    if (_instance == null) {
      _instance = new Database();
    }
    return _instance;
  }

  public Connection getConnection() throws ClassNotFoundException, SQLException {
    Class.forName(JDBC_DRIVER);
    log.debug("Connecting to database...");
    return DriverManager.getConnection(DB_URL, "root", "welcome01");
  }

  public void close(Connection con) {

  }

  public void close(Connection con, Statement stmt) {

  }

  public void close(Connection con, Statement stmt, ResultSet resultSet) {
    try {
      if (resultSet != null) {
        resultSet.close();
      }
      if (stmt != null) {
        stmt.close();
      }
      if (con != null) {
        con.close();
      }
    } catch (SQLException ex) {
      // Todo
    }
  }

}
