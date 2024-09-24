package com.ssafy.securities.coin.entity;

import com.ssafy.securities.coin.dto.CoinRestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collation = "coinhistory")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoinHistory {

    @Id
    private String id; // [code + date]
    private String coin; // 코인 종류
    private LocalDate date;
    private Double open;
    private Double close;
    private Double high;
    private Double low;
    private Double volume;
    private String interval;

    public CoinHistory (CoinRestDTO coinRestDTO, String interval) {
        this.id = coinRestDTO.getMarket() + coinRestDTO.getTimestamp();
        this.coin = coinRestDTO.getMarket();
        this.date = coinRestDTO.getCandleDateTimeKst().toLocalDate();
        this.open = coinRestDTO.getOpeningPrice();
        this.close = coinRestDTO.getTradePrice();
        this.high = coinRestDTO.getHighPrice();
        this.low = coinRestDTO.getLowPrice();
        this.volume = coinRestDTO.getCandleAccTradeVolume();
        this.interval = interval;
    }
}
