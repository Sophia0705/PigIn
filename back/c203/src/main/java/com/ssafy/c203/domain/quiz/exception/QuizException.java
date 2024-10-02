package com.ssafy.c203.domain.quiz.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum QuizException {
    QUIZ_NOT_FOUND("퀴즈를 찾을 수 없습니다.", HttpStatus.NOT_FOUND.value()),
//    INVALID_ANSWER("잘못된 답변입니다.", HttpStatus.BAD_REQUEST.value()),
    ;

    private final String message;
    private final int status;

    QuizException(String message, int status) {
        this.message = message;
        this.status = status;
    }
}
