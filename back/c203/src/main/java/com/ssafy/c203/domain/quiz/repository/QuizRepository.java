package com.ssafy.c203.domain.quiz.repository;

import com.ssafy.c203.domain.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    // 무작위 퀴즈 선택
    @Query(value = "SELECT * FROM quiz ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Quiz findRandomQuiz();
}
