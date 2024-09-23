package com.ssafy.c203.domain.members.exceprtion;

public class NotFoundException extends RuntimeException {

    @Override
    public String getMessage() {
        return MemberException.MEMBER_NOT_FOUND.getMessage();
    }

    public int getStatus() {
        return MemberException.MEMBER_NOT_FOUND.getStatus();
    }
}
