package com.ssafy.c203.domain.quiz.service;

import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.quiz.dto.request.MemberAnswerSubmitDto;
import com.ssafy.c203.domain.quiz.dto.response.QuizResultDto;
import com.ssafy.c203.domain.quiz.entity.Quiz;
import com.ssafy.c203.domain.quiz.exception.QuizException;
import com.ssafy.c203.domain.quiz.exception.QuizNotFoundException;
import com.ssafy.c203.domain.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {
    private final QuizRepository quizRepository;
    private final AccountService accountService;

    private final Integer MAX_PRICE = 100;
    private final Integer MIN_PRICE = 10;

    // TODO: 일일 퀴즈로 조회 필요할 경우 -> Redis 등에 퀴즈 푼 내역을 저장해야함
    @Override
    public Quiz provideQuiz() {

        Quiz findQuiz = quizRepository.findRandomQuiz();

        if (findQuiz == null) {
            throw new QuizNotFoundException(QuizException.QUIZ_NOT_FOUND);
        }

        return findQuiz;
    }

    @Override
    public QuizResultDto submitQuizResult(MemberAnswerSubmitDto memberAnswerSubmitDto, Long memberId) {
        QuizResultDto quizResultDto = new QuizResultDto();

        boolean isCorrectAnswer = compareUserAnswer(memberAnswerSubmitDto);
        String description = findDescription(memberAnswerSubmitDto.getId());

        if (isCorrectAnswer) {
            Long price = generateRewardPrice();
            accountService.depositAccount(memberId, price);
            quizResultDto.setReward(price);
        }

        quizResultDto.setResult(isCorrectAnswer);
        quizResultDto.setDescription(description);

        return quizResultDto;
    }

    @Override
    public Boolean compareUserAnswer(MemberAnswerSubmitDto memberAnswerSubmitDto) {
        Quiz quiz = quizRepository.findById(memberAnswerSubmitDto.getId())
                .orElseThrow(() -> new QuizNotFoundException(QuizException.QUIZ_NOT_FOUND));

        return quiz.getAnswer().getValue().equals(memberAnswerSubmitDto.getMemberAnswer().getValue());
    }

    @Override
    public Long generateRewardPrice() {
        Random random = new Random();
        return (long) (random.nextInt((MAX_PRICE - MIN_PRICE) + 1) + MIN_PRICE);
    }

    @Override
    public String findDescription(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException(QuizException.QUIZ_NOT_FOUND));
        return quiz.getDescription();
    }
}
