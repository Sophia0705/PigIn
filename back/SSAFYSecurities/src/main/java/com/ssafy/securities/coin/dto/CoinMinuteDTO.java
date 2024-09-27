package com.ssafy.securities.coin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CoinMinuteDTO {

    private String type;

    @JsonProperty("code")
    private String code; // 코인 코드 (예: "KRW-BTC")

    @JsonProperty("opening_price")
    private double openingPrice; // 시가

    @JsonProperty("high_price")
    private double highPrice; // 고가

    @JsonProperty("low_price")
    private double lowPrice; // 저가

    @JsonProperty("trade_price")
    private double tradePrice; // 현재 거래가

    @JsonProperty("prev_closing_price")
    private double prevClosingPrice; // 전일 종가

    @JsonProperty("acc_trade_price")
    private double accTradePrice; // 누적 거래 대금

    @JsonProperty("change")
    private String change; // 가격 변화 (예: "RISE", "FALL")

    @JsonProperty("change_price")
    private double changePrice; // 가격 변화량

    @JsonProperty("signed_change_price")
    private double signedChangePrice; // 서명된 가격 변화량

    @JsonProperty("change_rate")
    private double changeRate; // 가격 변화율

    @JsonProperty("signed_change_rate")
    private double signedChangeRate; // 서명된 가격 변화율

    @JsonProperty("ask_bid")
    private String askBid; // 매수/매도 구분

    @JsonProperty("trade_volume")
    private double tradeVolume; // 거래량

    @JsonProperty("acc_trade_volume")
    private double accTradeVolume; // 누적 거래량

    @JsonProperty("trade_date")
    private String tradeDate; // 거래 날짜

    @JsonProperty("trade_time")
    private String tradeTime; // 거래 시간

    @JsonProperty("trade_timestamp")
    private long tradeTimestamp; // 거래 타임스탬프 (밀리초 단위)

    @JsonProperty("acc_ask_volume")
    private double accAskVolume; // 매수 누적 거래량

    @JsonProperty("acc_bid_volume")
    private double accBidVolume; // 매도 누적 거래량

    @JsonProperty("highest_52_week_price")
    private double highest52WeekPrice; // 52주 최고가

    @JsonProperty("highest_52_week_date")
    private String highest52WeekDate; // 52주 최고가 달성일

    @JsonProperty("lowest_52_week_price")
    private double lowest52WeekPrice; // 52주 최저가

    @JsonProperty("lowest_52_week_date")
    private String lowest52WeekDate; // 52주 최저가 달성일

    @JsonProperty("market_state")
    private String marketState; // 시장 상태

    @JsonProperty("is_trading_suspended")
    private boolean isTradingSuspended; // 거래 중지 여부

    @JsonProperty("delisting_date")
    private String delistingDate; // 상장 폐지일

    @JsonProperty("market_warning")
    private String marketWarning; // 시장 경고

    @JsonProperty("timestamp")
    private long timestamp; // 데이터 수신 타임스탬프

    @JsonProperty("acc_trade_price_24h")
    private double accTradePrice24h; // 24시간 누적 거래 대금

    @JsonProperty("acc_trade_volume_24h")
    private double accTradeVolume24h; // 24시간 누적 거래량

    @JsonProperty("stream_type")
    private String streamType; // 스트림 타입 (예: "REALTIME", "SNAPSHOT")
}
