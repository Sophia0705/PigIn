package com.ssafy.c203.domain.coin.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import lombok.Data;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Data
public class FindCoinChartAllResponse {

    private String coinCode;

    @JsonProperty("coin_bsop_date")
    private String coinBusinessDate; // 날짜

    @JsonProperty("coin_bsop_time")
    private String coinBusinessTime;

    @JsonProperty("coin_clpr")
    private Double closePrice; // 종가

    @JsonProperty("coin_oprc")
    private Double openPrice; // 시가

    @JsonProperty("coin_hgpr")
    private Double highPrice; // 고가

    @JsonProperty("coin_lwpr")
    private Double lowPrice; // 저가

    @JsonProperty("acml_vol")
    private Double accumulatedVolume; // 거래량

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HHmmss");

    public FindCoinChartAllResponse(MongoCoinMinute minute) {
        this.coinCode = minute.getCoin();
        this.coinBusinessDate = minute.getDate().format(DATE_FORMATTER);
        this.coinBusinessTime = minute.getTime().format(TIME_FORMATTER);
        this.closePrice = minute.getClose();
        this.openPrice = minute.getOpen();
        this.highPrice = minute.getHigh();
        this.lowPrice = minute.getLow();
        this.accumulatedVolume = minute.getVolume();
    }

    public FindCoinChartAllResponse(MongoCoinHistory history) {
        this.coinCode = history.getCoin();
        this.coinBusinessDate = LocalDate.parse(history.getDate()).format(DATE_FORMATTER);
        this.coinBusinessTime = "000000"; // 일별 데이터의 경우 시간을 00:00:00으로 설정
        this.closePrice = Double.valueOf(history.getClose());
        this.openPrice = Double.valueOf(history.getOpen());
        this.highPrice = Double.valueOf(history.getHigh());
        this.lowPrice = Double.valueOf(history.getLow());
        this.accumulatedVolume = Double.valueOf(history.getVolume());
    }
}