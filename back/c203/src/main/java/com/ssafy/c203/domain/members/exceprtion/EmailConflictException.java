package com.ssafy.c203.domain.members.exceprtion;

public class EmailConflictException extends RuntimeException{
    @Override
    public String getMessage() {
        return MemberException.EMAIL_CONFLICT.getMessage();
    }

    public int getStatus() {
        return MemberException.EMAIL_CONFLICT.getStatus();
    }
}
