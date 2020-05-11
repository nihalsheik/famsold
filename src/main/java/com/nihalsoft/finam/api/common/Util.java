package com.nihalsoft.finam.api.common;

import com.fasterxml.jackson.databind.ObjectMapper;

public class Util {

  public static boolean isEmpty(Object value) {
    return value == null || value.toString().trim().equals("") || value.equals(0);
  }

  public static String toJson(Object value) {
    return Util.toJson(value, false);
  }

  public static String toJson(Object value, boolean format) {

    try {
      ObjectMapper om = new ObjectMapper();
      if(format) {
        return om.writerWithDefaultPrettyPrinter().writeValueAsString(value);  
      } else {
        return om.writeValueAsString(value);
      }
      
    } catch (Exception ex) {

    }
    return "";
  }

}
