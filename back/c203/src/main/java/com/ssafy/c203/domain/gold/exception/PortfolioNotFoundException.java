package com.ssafy.c203.domain.gold.exception;

public class PortfolioNotFoundException extends RuntimeException{

    @Override
    public String getMessage() {
        return GoldException.PORTFOLIO_NOT_FOUND.getMessage();
    }

    public int getStatus() {
        return GoldException.PORTFOLIO_NOT_FOUND.getStatus();
    }
}
