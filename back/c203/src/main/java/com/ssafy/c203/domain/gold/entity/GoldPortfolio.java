package com.ssafy.c203.domain.gold.entity;

import com.ssafy.c203.domain.members.entity.Members;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
public class GoldPortfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    private double priceAvg;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Members member;

    @Builder
    public GoldPortfolio(double amount, double priceAvg, Members member) {
        this.amount = amount;
        this.priceAvg = priceAvg;
        this.member = member;
    }

    public void minusAmount(double amount) {
        this.amount -= amount;
    }

    public void updatePortfolio(double amount, double priceAvg) {
        this.amount += amount;
        this.priceAvg = priceAvg;
    }
}
