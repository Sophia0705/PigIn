package com.ssafy.c203.domain.gold.exception;

public class GoldFavoriteNotFoundException extends RuntimeException{

    @Override
    public String getMessage() {
        return GoldException.GOLD_FAVORITE_NOT_FOUND.getMessage();
    }

    public int getStatus() {
        return GoldException.GOLD_FAVORITE_NOT_FOUND.getStatus();
    }
}
