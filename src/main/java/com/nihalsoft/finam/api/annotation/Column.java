package com.nihalsoft.finam.api.annotation;

import com.nihalsoft.finam.api.common.ColumnType;
import com.nihalsoft.finam.api.validator.ValidationRule;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface Column {

  String name() default "";

  ColumnType type() default ColumnType.TEXT;

  ValidationRule rule() default ValidationRule.NONE;

}
