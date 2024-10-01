package com.ssafy.c203.domain.quiz.service;

import com.ssafy.c203.domain.quiz.dto.request.MemberAnswerSubmitDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizResultDto;
import com.ssafy.c203.domain.quiz.entity.Quiz;

public interface QuizService {

    Quiz provideQuiz(); // 랜덤으로 문제 제공

    Boolean compareUserAnswer(MemberAnswerSubmitDto memberAnswerSubmitDto); // 회원이 문제 PK와 제출한 정답 정보를 주면 일치하는지 여부 확인

    Long generateRewardPrice(); // 정답일 경우 10~100원 가격 랜덤 생성 후 사용자 저축계좌에 입금

    String findDescription(Long quizId); //  퀴즈 해설 내용 조회

    QuizResultDto submitQuizResult(MemberAnswerSubmitDto memberAnswerSubmitDto, Long memberId); // 퀴즈 제출
}
