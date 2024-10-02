package com.ssafy.c203.domain.quiz.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum QuizException {
    QUIZ_NOT_FOUND("퀴즈를 찾을 수 없습니다.", HttpStatus.NOT_FOUND.value()),
    QUIZ_ALREADY_SOLVED("오늘의 퀴즈는 이미 풀었습니다.", HttpStatus.BAD_REQUEST.value()),
    ;

    private final String message;
    private final int status;

    QuizException(String message, int status) {
        this.message = message;
        this.status = status;
    }
}
