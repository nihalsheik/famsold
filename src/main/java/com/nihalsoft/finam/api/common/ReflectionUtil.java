package com.nihalsoft.finam.api.common;

import com.nihalsoft.finam.api.annotation.Column;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class ReflectionUtil {

  public static List<Field> getFields(Class<?> clazz) {

    List<Field> result = new ArrayList<Field>();

    if (!clazz.getSimpleName().equals("BaseModel")) {
      result.addAll(ReflectionUtil.getFields(clazz.getSuperclass()));
    }

    Field[] fields = clazz.getDeclaredFields();

    for (Field field : fields) {
      if (field.isAnnotationPresent(Column.class)) {
        result.add(field);
      }
    }

    return result;
  }
}
