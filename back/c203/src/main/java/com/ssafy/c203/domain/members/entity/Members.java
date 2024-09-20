package com.ssafy.c203.domain.members.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Members {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private WithDrawalStatus status;

    @Column(nullable = false)
    private String userKey;

    @Column(nullable = false)
    private String birth;

    private String refreshToken;

    private String role;

    @Builder
    public Members(String email, String password, String name, String phoneNumber,
        WithDrawalStatus status, String userKey, String birth, String role, String refreshToken) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = status;
        this.userKey = userKey;
        this.birth = birth;
        this.role = role;
        this.refreshToken = refreshToken;
    }

    public void updateUserKey(String userKey) {
        this.userKey = userKey;
    }

    public void updatePassword(String password) {
        this.password = password;
    }
}
