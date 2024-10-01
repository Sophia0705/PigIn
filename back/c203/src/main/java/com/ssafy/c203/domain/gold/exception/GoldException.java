package com.ssafy.c203.domain.gold.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum GoldException {
    NO_MONEY_EXCEPTION("통장의 금액이 부족합니다.", HttpStatus.BAD_REQUEST.value()),
    MORE_SELL_EXCEPTION("거래 금액이 보유 금액보다 많습니다.", HttpStatus.BAD_REQUEST.value()),
    ;

    private final String message;
    private final int status;

    GoldException(String message, int status) {
        this.message = message;
        this.status = status;
    }
}
