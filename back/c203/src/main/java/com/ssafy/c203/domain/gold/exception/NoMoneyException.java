package com.ssafy.c203.domain.gold.exception;

public class NoMoneyException extends RuntimeException {

    @Override
    public String getMessage() {
        return GoldException.NO_MONEY.getMessage();
    }

    public int getStatus() {
        return GoldException.NO_MONEY.getStatus();
    }

}
