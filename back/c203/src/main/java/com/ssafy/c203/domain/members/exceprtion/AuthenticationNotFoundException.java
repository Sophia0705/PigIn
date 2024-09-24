package com.ssafy.c203.domain.members.exceprtion;

public class AuthenticationNotFoundException extends RuntimeException{
    @Override
    public String getMessage() {
        return MemberException.AUTHENTICATION_NOT_FOUND.getMessage();
    }

    public int getStatus() {
        return MemberException.AUTHENTICATION_NOT_FOUND.getStatus();
    }
}
