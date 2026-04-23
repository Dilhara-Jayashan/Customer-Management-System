package com.dilhara.customer.exception;

public class DuplicateNICException extends RuntimeException {

    public DuplicateNICException(String message) {
        super(message);
    }

    public DuplicateNICException(String message, Throwable cause) {
        super(message, cause);
    }
}
