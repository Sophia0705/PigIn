package com.ssafy.c203.domain.members.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MMSAuthentication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phoneNumber;

    @Column(nullable = false)
    private String authenticationNumber;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createTime;

    @Builder
    public MMSAuthentication(String phoneNumber, String authenticationNumber,
        LocalDateTime deadline) {
        this.phoneNumber = phoneNumber;
        this.authenticationNumber = authenticationNumber;
        this.deadline = deadline;
    }
}
