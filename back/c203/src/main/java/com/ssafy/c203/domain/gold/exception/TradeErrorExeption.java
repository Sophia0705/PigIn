package com.ssafy.c203.domain.gold.exception;

public class TradeErrorExeption extends RuntimeException{
    @Override
    public String getMessage() {
        return GoldException.TRADE_ERROR.getMessage();
    }

    public int getStatus() {
        return GoldException.TRADE_ERROR.getStatus();
    }
}
