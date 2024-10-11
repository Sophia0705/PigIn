package com.ssafy.c203.domain.pay.exception;


public class MemberAccountNotFoundException extends RuntimeException{
    @Override
    public String getMessage() {
        return PayException.MEMBER_ACCOUNT_NOT_FOUND.getMessage();
    }

    public int getStatus() {
        return PayException.MEMBER_ACCOUNT_NOT_FOUND.getStatus();
    }
}
