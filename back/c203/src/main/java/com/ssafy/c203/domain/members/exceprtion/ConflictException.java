package com.ssafy.c203.domain.members.exceprtion;

public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }

}
