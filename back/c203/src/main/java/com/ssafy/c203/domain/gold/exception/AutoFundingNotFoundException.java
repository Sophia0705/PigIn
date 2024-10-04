package com.ssafy.c203.domain.gold.exception;

public class AutoFundingNotFoundException extends RuntimeException {

    @Override
    public String getMessage() {
        return GoldException.AUTO_FUNDING_NOT_FOUND.getMessage();
    }

    public int getStatus() {
        return GoldException.AUTO_FUNDING_NOT_FOUND.getStatus();
    }
}
