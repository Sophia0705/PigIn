package com.ssafy.c203.domain.pay.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum PayException {
    MEMBER_ACCOUNT_NOT_FOUND("사용자의 거래계좌를 찾을 수 없습니다.", HttpStatus.NOT_FOUND.value()),
    BUY_ERROR_EXCEPTION("거래 계좌 출금을 못했습니다.", HttpStatus.BAD_REQUEST.value()),
    DEPOSIT_ERROR_EXECPTION("투자 계좌 입금을 못했습니다.", HttpStatus.BAD_REQUEST.value()),
    ;
    private String message;
    private int status;

    PayException(String message, int status) {
        this.message = message;
        this.status = status;
    }
}
