package com.ssafy.c203.domain.quiz.service;

import com.ssafy.c203.domain.quiz.dto.request.MemberAnswerSubmitDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizResultDto;
import com.ssafy.c203.domain.quiz.entity.Quiz;

public interface QuizService {

    Quiz provideQuiz(); // 랜덤으로 문제 제공

    Long generateRewardPrice(); // 정답일 경우 10~100원 가격 랜덤 생성 후 사용자 저축계좌에 입금

    QuizResultDto submitQuizResult(MemberAnswerSubmitDto memberAnswerSubmitDto, Long memberId); // 퀴즈 제출
}
