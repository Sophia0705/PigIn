package com.ssafy.c203.domain.quiz.dto.request;

import com.ssafy.c203.domain.quiz.entity.OXAnswer;
import lombok.Data;

@Data
public class MemberAnswerSubmitDto {

    private Long id; // 문제 PK
    private OXAnswer memberAnswer; // 회원 답변 O, X
}
