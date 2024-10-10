package com.ssafy.c203.domain.quiz.dto.request;

import com.ssafy.c203.domain.quiz.entity.OXAnswer;
import lombok.Data;

@Data
public class StockQuizSubmitDto {

    private String stockCode; // 주식 종목 ID
    private OXAnswer memberAnswer; // 회원 답변 O, X  (O가 상승, X가 하락)
}