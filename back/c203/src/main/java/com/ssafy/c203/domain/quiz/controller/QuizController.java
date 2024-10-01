package com.ssafy.c203.domain.quiz.controller;

import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.quiz.dto.request.MemberAnswerSubmitDto;
import com.ssafy.c203.domain.quiz.dto.response.DailyQuizInfoDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizResultDto;
import com.ssafy.c203.domain.quiz.entity.Quiz;
import com.ssafy.c203.domain.quiz.service.QuizService;
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
    private final AccountService accountService;

    // 일일 퀴즈 조회
    @GetMapping("/daily")
    public ResponseEntity<DailyQuizInfoDto> getDailyQuizInfo() {
        Quiz quiz = quizService.provideQuiz();
        DailyQuizInfoDto dailyQuizInfoDto = new DailyQuizInfoDto(quiz.getId(), quiz.getQuestion());
        return ResponseEntity.ok().body(dailyQuizInfoDto);
    }

    // 퀴즈 결과
    @PostMapping("/result")
    public ResponseEntity<QuizResultDto> QuizResult(@RequestBody MemberAnswerSubmitDto memberAnswerSubmitDto, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long memberId = customUserDetails.getUserId();
        QuizResultDto quizResultDto = new QuizResultDto();

        boolean isCorrectAnswer = quizService.compareUserAnswer(memberAnswerSubmitDto);
        String description = quizService.findDescription(memberAnswerSubmitDto.getId());

        if (isCorrectAnswer) {
            Long price = quizService.generateRewardPrice();
            accountService.depositAccount(memberId, price);
            quizResultDto.setReward(price);
        }

        quizResultDto.setResult(isCorrectAnswer);
        quizResultDto.setDescription(description);

        return ResponseEntity.ok().body(quizResultDto);
    }
}
