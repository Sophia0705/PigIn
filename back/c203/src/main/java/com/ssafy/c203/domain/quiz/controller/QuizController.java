package com.ssafy.c203.domain.quiz.controller;

import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.quiz.dto.request.MemberAnswerSubmitDto;
import com.ssafy.c203.domain.quiz.dto.request.StockQuizSubmitDto;
import com.ssafy.c203.domain.quiz.dto.response.DailyQuizInfoDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizResultDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizStatusDto;
import com.ssafy.c203.domain.quiz.entity.Quiz;
import com.ssafy.c203.domain.quiz.service.QuizService;
import com.ssafy.c203.domain.quiz.dto.response.StockQuizResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/quiz")
public class QuizController {

    private final QuizService quizService;

    // 일일 퀴즈 조회
    @GetMapping("/daily")
    public ResponseEntity<DailyQuizInfoDto> getDailyQuizInfo() {
        log.info("=============getDailyQuizInfo============");
        Quiz quiz = quizService.provideQuiz();
        DailyQuizInfoDto dailyQuizInfoDto = new DailyQuizInfoDto(quiz.getId(), quiz.getQuestion());
        return ResponseEntity.ok().body(dailyQuizInfoDto);
    }

    // 퀴즈 결과
    @PostMapping("/result")
    public ResponseEntity<QuizResultDto> submitQuizResult(@RequestBody MemberAnswerSubmitDto memberAnswerSubmitDto, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        log.info("=============submitQuizResult !============");
        log.info("memberAnswerSubmitDto {}", memberAnswerSubmitDto);
        QuizResultDto quizResultDto = quizService.submitQuizResult(memberAnswerSubmitDto, customUserDetails.getUserId());
        log.info("quizResultDto: {}", quizResultDto);
        return ResponseEntity.ok().body(quizResultDto);
    }

    // 주가 예측 퀴즈 조회
    @GetMapping("/fluctuation")
    public ResponseEntity<StockQuizResponseDto> getStockQuiz() {
        StockQuizResponseDto quizData = quizService.getRandomStockQuizData();
        return ResponseEntity.ok(quizData);
    }

    // 주가 예측 퀴즈 답 제출
    @PostMapping("/fluctuation")
    public ResponseEntity<Void> submitStockQuiz(
            @RequestBody StockQuizSubmitDto stockQuizSubmitDto,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        quizService.submitStockQuiz(stockQuizSubmitDto, customUserDetails.getUserId());

        return ResponseEntity.ok().build();
    }

    // 일일 퀴즈 풀이 여부 판별
    @GetMapping("/status")
    public ResponseEntity<QuizStatusDto> getQuizStatus(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        QuizStatusDto quizStatus = quizService.getQuizStatus(customUserDetails.getUserId());
        return ResponseEntity.ok(quizStatus);
    }
}
