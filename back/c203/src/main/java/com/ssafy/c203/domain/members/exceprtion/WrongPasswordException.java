package com.ssafy.c203.domain.members.exceprtion;

public class WrongPasswordException extends RuntimeException{
    @Override
    public String getMessage() {
        return MemberException.WRONG_PASSWORD.getMessage();
    }

    public int getStatus() {
        return MemberException.WRONG_PASSWORD.getStatus();
    }
}
