package com.ssafy.c203.domain.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizStatusDto {
    private boolean oxQuizSolved;
    private boolean stockQuizSolved;
}