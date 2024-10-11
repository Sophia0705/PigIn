package com.ssafy.securities.coin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CoinWebSocketBarDTO {

    @JsonProperty("type")
    private String type;

    @JsonProperty("code")
    private String code;

    @JsonProperty("opening_price")
    private double openingPrice;

    @JsonProperty("high_price")
    private double highPrice;

    @JsonProperty("low_price")
    private double lowPrice;

    @JsonProperty("trade_price")
    private double tradePrice;

    @JsonProperty("prev_closing_price")
    private double prevClosingPrice;

    @JsonProperty("acc_trade_price")
    private double accTradePrice;

    @JsonProperty("change")
    private String change;

    @JsonProperty("change_price")
    private double changePrice;

    @JsonProperty("signed_change_price")
    private double signedChangePrice;

    @JsonProperty("change_rate")
    private double changeRate;

    @JsonProperty("signed_change_rate")
    private double signedChangeRate;

    @JsonProperty("ask_bid")
    private String askBid;

    @JsonProperty("trade_volume")
    private double tradeVolume;

    @JsonProperty("acc_trade_volume")
    private double accTradeVolume;

    @JsonProperty("trade_date")
    private String tradeDate;

    @JsonProperty("trade_time")
    private String tradeTime;

    @JsonProperty("trade_timestamp")
    private long tradeTimestamp;

    @JsonProperty("acc_ask_volume")
    private double accAskVolume;

    @JsonProperty("acc_bid_volume")
    private double accBidVolume;

    @JsonProperty("highest_52_week_price")
    private double highest52WeekPrice;

    @JsonProperty("highest_52_week_date")
    private String highest52WeekDate;

    @JsonProperty("lowest_52_week_price")
    private double lowest52WeekPrice;

    @JsonProperty("lowest_52_week_date")
    private String lowest52WeekDate;

    @JsonProperty("market_state")
    private String marketState;

    @JsonProperty("is_trading_suspended")
    private boolean isTradingSuspended;

    @JsonProperty("delisting_date")
    private String delistingDate;

    @JsonProperty("market_warning")
    private String marketWarning;

    @JsonProperty("timestamp")
    private long timestamp;

    @JsonProperty("acc_trade_price_24h")
    private double accTradePrice24h;

    @JsonProperty("acc_trade_volume_24h")
    private double accTradeVolume24h;

    @JsonProperty("stream_type")
    private String streamType;
}
