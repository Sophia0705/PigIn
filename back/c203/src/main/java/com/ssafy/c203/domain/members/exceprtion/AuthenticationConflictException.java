package com.ssafy.c203.domain.members.exceprtion;

public class AuthenticationConflictException extends RuntimeException {
    @Override
    public String getMessage() {
        return MemberException.AUTHENTICATION_CONFLICT.getMessage();
    }

    public int getStatus() {
        return MemberException.AUTHENTICATION_CONFLICT.getStatus();
    }

}
