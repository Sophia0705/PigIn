package com.ssafy.c203.domain.stock.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import lombok.Data;

@Data
public class FindStockChartAllResponse {
    @JsonProperty("stck_bsop_date")
    private String stockBusinessDate; // 날짜

    @JsonProperty("stck_clpr")
    private String closePrice; // 종가

    @JsonProperty("stck_oprc")
    private String openPrice; // 시가

    @JsonProperty("stck_hgpr")
    private String highPrice; // 고가

    @JsonProperty("stck_lwpr")
    private String lowPrice; // 저가

    @JsonProperty("acml_vol")
    private String accumulatedVolume; // 거래량

//    @JsonProperty("acml_tr_pbmn")
//    private String accumulatedTradeAmount; // 거래대금
//
//    @JsonProperty("flng_cls_code")
//    private String flagCode; // 플래그 코드 (특이사항 코드)
//
//    @JsonProperty("prtt_rate")
//    private String dividendRate; // 배당률
//
//    @JsonProperty("mod_yn")
//    private String modifiedYn; // 수정여부 (원본 여부)
//
//    @JsonProperty("prdy_vrss_sign")
//    private String previousDayChangeSign; // 전일 대비 등락 부호 (사용 안할듯)
//
//    @JsonProperty("prdy_vrss")
//    private String previousDayChange; // 전일 대비 등락 가격
//
//    @JsonProperty("revl_issu_reas")
//    private String reason; // 발생 사유 (없음)

    public FindStockChartAllResponse (MongoStockHistory mongoStockHistory) {
        this.stockBusinessDate = mongoStockHistory.getDate();
        this.closePrice = mongoStockHistory.getClose();
        this.openPrice = mongoStockHistory.getOpen();
        this.highPrice = mongoStockHistory.getHigh();
        this.lowPrice = mongoStockHistory.getLow();
        this.accumulatedVolume = mongoStockHistory.getVolume();
//        this.accumulatedTradeAmount = "";
//        this.flagCode = "";
//        this.dividendRate = "";
//        this.modifiedYn = "";
//        this.previousDayChangeSign = "";
//        this.previousDayChange = "";
//        this.reason = "";
    }
}
