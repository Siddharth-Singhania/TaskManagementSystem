package com.capstone.taskmanagement.dto;

import java.util.ArrayList;
import java.util.List;

public class ErrorResponse {

    private String error;
    private String message;
    private List<FieldError> fieldErrors;

    public ErrorResponse() {
        this.fieldErrors = new ArrayList<>();
    }

    public ErrorResponse(String error) {
        this();
        this.error = error;
    }

    public ErrorResponse(String error, String message) {
        this();
        this.error = error;
        this.message = message;
    }

    public ErrorResponse(String error, List<FieldError> fieldErrors) {
        this.error = error;
        this.fieldErrors = fieldErrors;
    }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<FieldError> getFieldErrors() { return fieldErrors; }
    public void setFieldErrors(List<FieldError> fieldErrors) { this.fieldErrors = fieldErrors; }

    public static class FieldError {
        private String field;
        private String message;

        public FieldError() {}

        public FieldError(String field, String message) {
            this.field = field;
            this.message = message;
        }

        public String getField() { return field; }
        public void setField(String field) { this.field = field; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
