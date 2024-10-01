package com.ssafy.c203.domain.quiz.exception;


public class QuizNotFoundException extends RuntimeException {
    private final QuizException quizException;

    public QuizNotFoundException(QuizException quizException) {
        super(quizException.getMessage());
        this.quizException = quizException;
    }

    public int getStatus() {
        return quizException.getStatus();
    }
}