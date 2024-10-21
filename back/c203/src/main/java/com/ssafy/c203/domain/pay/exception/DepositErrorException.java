package com.ssafy.c203.domain.pay.exception;

public class DepositErrorException extends RuntimeException{

    @Override
    public String getMessage() {
        return PayException.DEPOSIT_ERROR_EXECPTION.getMessage();
    }

    public int getStatus() {
        return PayException.DEPOSIT_ERROR_EXECPTION.getStatus();
    }

}
