package com.ssafy.c203.domain.members.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String accountNo;

    @Column(nullable = false)
    private String bank;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Members member;

    @Builder
    public MemberAccount(String accountNo, String bank, Members member) {
        this.accountNo = accountNo;
        this.bank = bank;
        this.member = member;
    }
}
