package com.ssafy.c203.domain.quiz.service;

import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.quiz.dto.request.MemberAnswerSubmitDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizResultDto;
import com.ssafy.c203.domain.quiz.entity.Quiz;
import com.ssafy.c203.domain.quiz.exception.QuizException;
import com.ssafy.c203.domain.quiz.exception.QuizNotFoundException;
import com.ssafy.c203.domain.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {
    private static final Integer MAX_REWARD_PRICE = 100;
    private static final Integer MIN_REWARD_PRICE = 10;
    private static final Logger log = LoggerFactory.getLogger(QuizServiceImpl.class);

    private final QuizRepository quizRepository;
    private final AccountService accountService;

    // TODO: 일일 퀴즈로 조회 필요할 경우 -> Redis 등에 퀴즈 푼 내역을 저장해야함
    @Override
    public Quiz provideQuiz() {

        return quizRepository.findRandomQuiz()
                .orElseThrow(() -> new QuizNotFoundException(QuizException.QUIZ_NOT_FOUND));
    }

    @Override
    @Transactional
    public QuizResultDto submitQuizResult(MemberAnswerSubmitDto memberAnswerSubmitDto, Long memberId) {
        // 정답 확인 및 퀴즈 조회
        Quiz quiz = quizRepository.findById(memberAnswerSubmitDto.getId())
                .orElseThrow(() -> new QuizNotFoundException(QuizException.QUIZ_NOT_FOUND));

        Boolean isCorrectAnswer = quiz.getAnswer().getValue().equals(memberAnswerSubmitDto.getMemberAnswer().getValue());

        QuizResultDto quizResultDto = new QuizResultDto();
        quizResultDto.setResult(isCorrectAnswer);
        quizResultDto.setDescription(quiz.getDescription());

        // 정답
        if (isCorrectAnswer) {
            Long rewardPrice = generateRewardPrice();
            Long depositBeforeBalance = accountService.findDAccountBalanceByMemberId(memberId);
            log.info("입금 전 저축 계좌 잔액: {}", depositBeforeBalance);
            accountService.depositAccount(memberId, rewardPrice);
            Long depositAfterBalance = accountService.findDAccountBalanceByMemberId(memberId);
            log.info("입금 후 저축 계좌 잔액: {}", depositAfterBalance);
            quizResultDto.setReward(rewardPrice);
        } else {
            quizResultDto.setReward(0L); // 오답
        }

        return quizResultDto;
    }

    @Override
    public Long generateRewardPrice() {
        Random random = new Random();
        return (long) (random.nextInt((MAX_REWARD_PRICE - MIN_REWARD_PRICE) + 1) + MIN_REWARD_PRICE);
    }
}
