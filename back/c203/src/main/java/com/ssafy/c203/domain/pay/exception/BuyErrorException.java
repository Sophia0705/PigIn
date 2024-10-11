package com.ssafy.c203.domain.pay.exception;

public class BuyErrorException extends RuntimeException {

    @Override
    public String getMessage() {
        return PayException.BUY_ERROR_EXCEPTION.getMessage();
    }

    public int getStatus() {
        return PayException.BUY_ERROR_EXCEPTION.getStatus();
    }
}
