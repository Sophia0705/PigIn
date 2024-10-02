package com.ssafy.c203.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question; // 문제 내용

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OXAnswer answer; // 정답 (O, X)

    @Column(nullable = false)
    private String description; // 문제 해설
}
