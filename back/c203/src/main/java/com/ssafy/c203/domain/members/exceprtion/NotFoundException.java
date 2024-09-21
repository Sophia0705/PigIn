package com.ssafy.c203.domain.members.exceprtion;

public class NotFoundException extends RuntimeException{
    public NotFoundException(String message) {
        super(message);
    }
}
