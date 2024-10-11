package com.ssafy.c203.domain.gold.exception;

public class MoreSellException extends RuntimeException {

    @Override
    public String getMessage() {
        return GoldException.MORE_SELL_EXCEPTION.getMessage();
    }

    public int getStatus() {
        return GoldException.MORE_SELL_EXCEPTION.getStatus();
    }

}
