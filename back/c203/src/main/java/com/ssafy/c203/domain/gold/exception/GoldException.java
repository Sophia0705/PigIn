package com.ssafy.c203.domain.gold.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum GoldException {
    NO_MONEY_EXCEPTION("통장의 금액이 부족합니다.", HttpStatus.BAD_REQUEST.value()),
    MORE_SELL_EXCEPTION("거래 금액이 보유 금액보다 많습니다.", HttpStatus.BAD_REQUEST.value()),
    TRADE_ERROR("거래 중 에러가 발생했습니다.", HttpStatus.BAD_REQUEST.value()),
    AUTO_FUNDING_NOT_FOUND("금 자동 투자 상품을 찾지 못했습니다.", HttpStatus.NOT_FOUND.value()),
    ;

    private final String message;
    private final int status;

    GoldException(String message, int status) {
        this.message = message;
        this.status = status;
    }
}
