package com.ssafy.c203.domain.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockQuizResponseDto {
    private String stockCode;   // 종목 코드
    private String stockName;   // 종목명
    private String currentPrice; // 현재 가격
}