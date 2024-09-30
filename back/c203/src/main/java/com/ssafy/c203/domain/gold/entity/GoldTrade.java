package com.ssafy.c203.domain.gold.entity;

import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.members.entity.Members;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GoldTrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private TradeMethod method;

    @Column(nullable = false)
    private double count;

    @Column(nullable = false)
    private int tradePrice;

    @Column(nullable = false)
    private int goldPrice;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime tradeTime;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Members member;

    @Builder
    public GoldTrade(TradeMethod method, double count, int tradePrice, int goldPrice,
        Members member) {
        this.method = method;
        this.count = count;
        this.tradePrice = tradePrice;
        this.goldPrice = goldPrice;
        this.member = member;
    }
}
