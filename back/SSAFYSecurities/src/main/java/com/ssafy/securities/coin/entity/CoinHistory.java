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
    private String date;
    private String open;
    private String close;
    private String high;
    private String low;
    private String volume;
    private String interval;

    public CoinHistory (CoinRestDTO coinRestDTO, String interval) {
        this.coin = coinRestDTO.getMarket();
        this.date = coinRestDTO.getCandleDateTimeKst().toLocalDate().toString();
        this.open = String.valueOf(coinRestDTO.getOpeningPrice());
        this.close = String.valueOf(coinRestDTO.getTradePrice());
        this.high = String.valueOf(coinRestDTO.getHighPrice());
        this.low = String.valueOf(coinRestDTO.getLowPrice());
        this.volume = String.valueOf(coinRestDTO.getCandleAccTradeVolume());
        this.interval = interval;
    }
}
