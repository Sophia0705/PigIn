package com.ssafy.c203.domain.quiz.dto.response;

import lombok.Data;

@Data
public class QuizResultDto {

    private Boolean result; // 정답 여부
    private String description; // 문제 설명
    private Long reward; // 수익금 10~100원 랜덤 제공 / 실패시 0원
}
