package com.ssafy.c203.domain.gold.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum GoldException {
    NO_MONEY("통장의 금액이 부족합니다.", HttpStatus.BAD_REQUEST.value()),
    ;

    private final String message;
    private final int status;

    GoldException(String message, int status) {
        this.message = message;
        this.status = status;
    }
}
