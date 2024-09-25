package com.ssafy.securities.coin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CoinRestDTO {
    @JsonProperty("market")
    private String market; // 마켓명

    @JsonProperty("candle_date_time_utc")
    private LocalDateTime candleDateTimeUtc; // 캔들 기준 시각(UTC 기준)

    @JsonProperty("candle_date_time_kst")
    private LocalDateTime candleDateTimeKst; // 캔들 기준 시각(KST 기준)

    @JsonProperty("opening_price")
    private double openingPrice; // 시가

    @JsonProperty("high_price")
    private double highPrice; // 고가

    @JsonProperty("low_price")
    private double lowPrice; // 저가

    @JsonProperty("trade_price")
    private double tradePrice; // 종가

    @JsonProperty("timestamp")
    private long timestamp; // 마지막 틱이 저장된 시각

    @JsonProperty("candle_acc_trade_price")
    private double candleAccTradePrice; // 누적 거래 금액

    @JsonProperty("candle_acc_trade_volume")
    private double candleAccTradeVolume; // 누적 거래량

    @JsonProperty("first_day_of_period")
    private String firstDayOfPeriod; // 캔들 기간의 가장 첫 날

}
