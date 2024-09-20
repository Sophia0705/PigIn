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
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GoldTrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private TradeMethod method;

    @Column(nullable = false)
    private float count;

    @Column(nullable = false)
    private int price;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime tradeTime;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Members member;
}
