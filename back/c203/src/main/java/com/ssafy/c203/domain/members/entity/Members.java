package com.ssafy.c203.domain.members.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Members {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WithDrawalStatus status;

    @Column(nullable = false)
    private String userKey;

    @Column(nullable = false)
    private String birth;

    @Column(columnDefinition = "TEXT")
    private String refreshToken;

    private String role;

    private int savingRate = 0;

    private int savingAmount = 0;

    @Enumerated(EnumType.STRING)
    private AutoFundingStatus autoFundingStatus = AutoFundingStatus.INACTIVE;

    @Builder
    public Members(String email, String password, String name, String phoneNumber,
        WithDrawalStatus status, String userKey, String birth, String role, String refreshToken,
        int savingRate) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.status = status;
        this.userKey = userKey;
        this.birth = birth;
        this.role = role;
        this.refreshToken = refreshToken;
        this.savingRate = savingRate;
    }

    public void updateUserKey(String userKey) {
        this.userKey = userKey;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void deleteRefreshToken() {
        this.refreshToken = null;
    }

    public void withDrawal() {
        this.status = WithDrawalStatus.INACTIVE;
    }

    public void updateSavingRate(int savingRate) {
        this.savingRate = savingRate;
    }

    public void updateSavingRateAndPhoneNumber(int savingRate, String phoneNumber) {
        this.savingRate = savingRate;
        this.phoneNumber = phoneNumber;
    }

    public void updateId(Long id) {
        this.id = id;
    }
}
