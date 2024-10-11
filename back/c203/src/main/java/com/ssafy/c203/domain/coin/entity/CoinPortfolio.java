package com.ssafy.c203.domain.coin.entity;

import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.stock.entity.StockItem;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CoinPortfolio {

    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(name = "coid_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private CoinItem coinItem;

    @JoinColumn(name = "member_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Members member;

    private Double amount;

    @Column(name = "price_avg")
    private Double priceAvg;

    public void addAmount(Double amount) {
        this.amount += amount;
    }

    public void subAmount(Double amount) {
        this.amount -= amount;
    }

    public void updatePriceAve(Double price, Double newAmount) {
        this.priceAvg = (priceAvg * amount + price * newAmount) / (amount + newAmount);
    }

}
