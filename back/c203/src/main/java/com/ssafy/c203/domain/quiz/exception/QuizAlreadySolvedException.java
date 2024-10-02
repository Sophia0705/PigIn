package com.ssafy.c203.domain.quiz.exception;

public class QuizAlreadySolvedException extends RuntimeException {
    private final QuizException quizException;

    public QuizAlreadySolvedException(QuizException quizException) {
        super(quizException.getMessage());
        this.quizException = quizException;
    }

    public int getStatus() {
        return quizException.getStatus();
    }
}