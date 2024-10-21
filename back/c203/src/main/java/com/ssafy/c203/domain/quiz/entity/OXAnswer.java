package com.ssafy.c203.domain.quiz.entity;

import lombok.Getter;

@Getter
public enum OXAnswer {
    O("O"), X("X");

    private final String value;

    OXAnswer(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}