package com.ssafy.c203.domain.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DailyQuizInfoDto {
    private Long id; // 문제 PK
    private String question; // 문제 내용
}