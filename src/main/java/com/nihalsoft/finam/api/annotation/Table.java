package com.nihalsoft.finam.api.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Table {

  String name() default "";

  Class<?> model();

}
