package com.ssafy.c203.domain.stock.entity;

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

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class StockTrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private TradeMethod method;

    @Column(nullable = false)
    private Double count;

    @Column(nullable = false)
    private Double price;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime tradeTime;

    @JoinColumn(name = "stock_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private StockItem stockItem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Members member;
}
