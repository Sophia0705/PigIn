package com.ssafy.c203.domain.members.exceprtion;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum MemberException {
    MEMBER_NOT_FOUND("해당 member를 찾지 못했습니다.", HttpStatus.NOT_FOUND.value()),
    AUTHENTICATION_CONFLICT("인증번호가 틀렸습니다.", HttpStatus.CONFLICT.value()),
    EMAIL_CONFLICT("이메일이 이미 존재합니다.", HttpStatus.CONFLICT.value()),
    WRONG_PASSWORD("패스워드가 일치하지 않습니다.", HttpStatus.BAD_REQUEST.value()),
    AUTHENTICATION_NOT_FOUND("인증정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND.value()),;

    private final String message;
    private final int status;

    private MemberException(final String message, final int status) {
        this.message = message;
        this.status = status;
    }
}
