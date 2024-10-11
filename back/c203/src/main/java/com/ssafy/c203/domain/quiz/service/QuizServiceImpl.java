package com.ssafy.c203.domain.quiz.service;

import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.quiz.dto.request.MemberAnswerSubmitDto;
import com.ssafy.c203.domain.quiz.dto.request.StockQuizSubmitDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizResultDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizStatusDto;
import com.ssafy.c203.domain.quiz.entity.Quiz;
import com.ssafy.c203.domain.quiz.exception.QuizAlreadySolvedException;
import com.ssafy.c203.domain.quiz.exception.QuizException;
import com.ssafy.c203.domain.quiz.exception.QuizNotFoundException;
import com.ssafy.c203.domain.quiz.repository.QuizRepository;
import com.ssafy.c203.domain.quiz.dto.response.StockQuizResponseDto;
import com.ssafy.c203.domain.stock.entity.StockItem;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
import com.ssafy.c203.domain.stock.repository.StockItemRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockMinuteRepository;
import com.ssafy.c203.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisKeyCommands;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
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
    private final StockItemRepository stockItemRepository;
    private final MongoStockMinuteRepository mongoStockMinuteRepository;

    private final AccountService accountService;
    private final StockService stockService;

    @Override
    public Quiz provideQuiz() {

        return quizRepository.findRandomQuiz()
            .orElseThrow(() -> new QuizNotFoundException(QuizException.QUIZ_NOT_FOUND));
    }

    @Override
    @Transactional
    public QuizResultDto submitQuizResult(MemberAnswerSubmitDto memberAnswerSubmitDto,
        Long memberId) {

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

        Boolean isCorrectAnswer = quiz.getAnswer().getValue()
            .equals(memberAnswerSubmitDto.getMemberAnswer().getValue());

        QuizResultDto quizResultDto = new QuizResultDto();
        quizResultDto.setResult(isCorrectAnswer);
        quizResultDto.setDescription(quiz.getDescription());

        // 정답
        if (isCorrectAnswer) {
            Long rewardPrice = generateRewardPrice();
            Long depositBeforeBalance = accountService.findDAccountBalanceByMemberId(memberId);
            accountService.depositAccount(memberId, rewardPrice);
            Long depositAfterBalance = accountService.findDAccountBalanceByMemberId(memberId);
            quizResultDto.setReward(rewardPrice);
        } else {
            quizResultDto.setReward(0L); // 오답
        }

        valueOperations.set(redisKey, true, 1, TimeUnit.DAYS);

        return quizResultDto;
    }

    @Override
    public Long generateRewardPrice() {
        return MIN_REWARD_PRICE + (long) (Math.random() * (MAX_REWARD_PRICE - MIN_REWARD_PRICE
            + 1));
    }


    // 매일 오전 9시에 Daily Quiz 풀이 여부 초기화
//    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Seoul")
    @Scheduled(cron = "0 43 10 * * *", zone = "Asia/Seoul")
    public void resetDailyQuizKeys() {
        int retryCount = 0;

        while (retryCount < MAX_RETRY_COUNT) {
            try {

                RedisConnectionFactory connectionFactory = redisTemplate.getConnectionFactory();
                if (connectionFactory != null) {
                    RedisKeyCommands keyCommands = connectionFactory.getConnection().keyCommands();

                    try (Cursor<byte[]> cursor = keyCommands.scan(
                        ScanOptions.scanOptions().match("QUIZ_SOLVED:*").build())) {
                        while (cursor.hasNext()) {
                            String redisKey = new String(cursor.next());
                            redisTemplate.delete(redisKey);
                        }
                    }

                    break; // 성공 시 재시도 중지
                }
            } catch (Exception e) {
                retryCount++;
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException ignored) {
                }
            }
        }
    }


    @Override
    @Transactional(readOnly = true)
    public StockQuizResponseDto getRandomStockQuizData() {
        // Step 1: stock_Item 테이블에서 랜덤으로 종목 선택
        List<StockItem> stockItems = stockItemRepository.findAll();
        if (stockItems.isEmpty()) {
            throw new RuntimeException("종목이 없다..");
        }

        // 랜덤으로 주식 종목 선택
        StockItem selectedStock = stockItems.get(new Random().nextInt(stockItems.size()));

        // Step 2: MongoDB의 stockMinute에서 해당 종목의 현재 가격 조회
        MongoStockMinute latestStockMinute = findLatestStockMinute(selectedStock.getId());
        if (latestStockMinute == null) {
            throw new RuntimeException("사용가능한 분봉 데이터 없음");
        }

        // Step 3: 응답 DTO 구성
        return new StockQuizResponseDto(
            selectedStock.getId(),
            selectedStock.getName(),
            latestStockMinute.getClose()
        );
    }

    @Transactional(readOnly = true)
    public MongoStockMinute findLatestStockMinute(String stockCode) {
        return mongoStockMinuteRepository.findTopByStockCodeOrderByDateDescTimeDesc(stockCode)
            .orElseThrow(() -> new RuntimeException("분봉 데이터가 조회 실패 stockCode: " + stockCode));
    }

    @Override
    @Transactional
    public void submitStockQuiz(StockQuizSubmitDto stockQuizSubmitDto, Long memberId) {
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
        String redisKey = "STOCK_FLUCTUATION_QUIZ_SOLVED:" + memberId;

        // Step 1: Redis에서 일일 퀴즈 풀이 여부 확인
        boolean hasSolved = valueOperations.get(redisKey) != null;
        if (hasSolved) {
            throw new QuizAlreadySolvedException(QuizException.QUIZ_ALREADY_SOLVED);
        }

        // Step 2: 사용자 퀴즈 제출 기록 저장
        String answerKey =
            "STOCK_FLUCTUATION_QUIZ_ANSWER:" + memberId + ":" + stockQuizSubmitDto.getStockCode();
        valueOperations.set(answerKey, stockQuizSubmitDto.getMemberAnswer().getValue(), 1,
            TimeUnit.DAYS);
        valueOperations.set(redisKey, true, 1, TimeUnit.DAYS);
    }


    @Scheduled(cron = "0 40 11 * * *", zone = "Asia/Seoul")
    public void judgeStockQuizResults() {
        try {
            // Step 1: RedisConnectionFactory 확인 및 RedisConnection 얻기
            RedisConnectionFactory connectionFactory = redisTemplate.getConnectionFactory();
            if (connectionFactory == null) {
                return;
            }

            try (Cursor<byte[]> cursor = connectionFactory.getConnection().scan(
                ScanOptions.scanOptions().match("STOCK_FLUCTUATION_QUIZ_ANSWER:*").build())) {

                // Step 2: 조회된 키 처리
                while (cursor.hasNext()) {
                    String key = new String(cursor.next());
                    try {
                        // 키에서 회원 ID와 주식 ID 추출
                        String[] keyParts = key.split(":");
                        Long memberId = Long.parseLong(keyParts[1]);
                        String stockId = keyParts[2];

                        // 사용자 답안 조회
                        String memberAnswer = (String) redisTemplate.opsForValue().get(key);
                        MongoStockDetail stockDetail = stockService.findStockDetail(stockId);

                        // Step 3: 등락률 기반 판별
                        boolean isCorrect = stockDetail.getPrdyCtrt().startsWith("+")
                            ? memberAnswer.equals("O")
                            : memberAnswer.equals("X");

                        // Step 4: 보상 처리 및 Redis 키 삭제
                        if (isCorrect) {
                            Long rewardPrice = generateRewardPrice();
                            accountService.depositAccount(memberId, rewardPrice);
                        }

                        // Step 5: 처리 후 Redis에서 키 삭제
                        redisTemplate.delete(key);
                        redisTemplate.delete("STOCK_FLUCTUATION_QUIZ_SOLVED:" + memberId);

                    } catch (NumberFormatException ignored) {
                    }
                }
            } catch (Exception ignored) {
            }
        } catch (Exception ignored) {
        }
    }


    @Override
    public QuizStatusDto getQuizStatus(Long memberId) {
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();

        // OX퀴즈 풀이 여부 조회
        String oxQuizKey = "QUIZ_SOLVED:" + memberId;
        boolean oxQuizSolved = valueOperations.get(oxQuizKey) != null;

        // 주가 예측 퀴즈 풀이 여부 조회
        String stockQuizKey = "STOCK_FLUCTUATION_QUIZ_SOLVED:" + memberId;
        boolean stockQuizSolved = valueOperations.get(stockQuizKey) != null;

        return new QuizStatusDto(oxQuizSolved, stockQuizSolved);
    }
}