package com.ssafy.c203.domain.quiz.service;

import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.quiz.dto.request.MemberAnswerSubmitDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizResultDto;
import com.ssafy.c203.domain.quiz.entity.Quiz;
import com.ssafy.c203.domain.quiz.exception.QuizAlreadySolvedException;
import com.ssafy.c203.domain.quiz.exception.QuizException;
import com.ssafy.c203.domain.quiz.exception.QuizNotFoundException;
import com.ssafy.c203.domain.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class QuizServiceImpl implements QuizService {
    private static final Integer MAX_REWARD_PRICE = 100;
    private static final Integer MIN_REWARD_PRICE = 10;
    private static final int MAX_RETRY_COUNT = 3;

    private final RedisTemplate<String, Object> redisTemplate;
    private final QuizRepository quizRepository;
    private final AccountService accountService;

    @Override
    public Quiz provideQuiz() {

        return quizRepository.findRandomQuiz()
                .orElseThrow(() -> new QuizNotFoundException(QuizException.QUIZ_NOT_FOUND));
    }

    @Override
    @Transactional
    public QuizResultDto submitQuizResult(MemberAnswerSubmitDto memberAnswerSubmitDto, Long memberId) {

        // Redis에서 퀴즈 풀이 여부 확인
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
        String redisKey = "QUIZ_SOLVED:" + memberId;
        boolean hasSolved = valueOperations.get(redisKey) != null;

        if (hasSolved) {
            throw new QuizAlreadySolvedException(QuizException.QUIZ_ALREADY_SOLVED);
        }

        // 정답 확인 및 퀴즈 조회
        Quiz quiz = quizRepository.findById(memberAnswerSubmitDto.getId())
                .orElseThrow(() -> new QuizNotFoundException(QuizException.QUIZ_NOT_FOUND));

        Boolean isCorrectAnswer = quiz.getAnswer().getValue().equals(memberAnswerSubmitDto.getMemberAnswer().getValue());

        QuizResultDto quizResultDto = new QuizResultDto();
        quizResultDto.setResult(isCorrectAnswer);
        quizResultDto.setDescription(quiz.getDescription());

        log.info("회원 ID {}의 퀴즈 풀이 결과: {}", memberId, isCorrectAnswer ? "정답" : "오답");

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

        valueOperations.set(redisKey, true, 1, TimeUnit.DAYS);

        return quizResultDto;
    }

    @Override
    public Long generateRewardPrice() {
        return MIN_REWARD_PRICE + (long) (Math.random() * (MAX_REWARD_PRICE - MIN_REWARD_PRICE + 1));
    }


    // 매일 오전 9시에 Daily Quiz 풀이 여부 초기화
    @Scheduled(cron = "0 0 9 * * *")
    public void resetDailyQuizKeys() {
        int retryCount = 0;

        while (retryCount < MAX_RETRY_COUNT) {
            try {
                log.info("Redis 키 삭제 작업 시도: {} / {}", (retryCount + 1), MAX_RETRY_COUNT);

                // QUIZ_SOLVED로 시작하는 모든 키 가져오기
                Set<String> keys = redisTemplate.keys("QUIZ_SOLVED:*");
                if (keys != null && !keys.isEmpty()) {
                    redisTemplate.delete(keys);
                    keys.forEach(key -> log.info("Deleted Redis Key: " + key));
                }

                log.info("Redis 키 삭제 작업 성공");
                break; // 성공 시 재시도 중지

            } catch (Exception e) {
                retryCount++;
                log.error("Redis 작업 실패, 재시도 중... ({} / {})   error: {}", retryCount, MAX_RETRY_COUNT, e.getMessage());

                try {
                    Thread.sleep(5000); // 5초 대기 후 재시도
                } catch (InterruptedException interruptedException) {
                    log.error("재시도 대기 중 인터럽트 발생: {}", interruptedException.getMessage());
                }
            }
        }
    }

}