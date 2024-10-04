package com.ssafy.securities.coin.dto;

import lombok.Data;

@Data
public class CoinTradeResponse {
    private Double result;
    private Double tradePrice;

    public CoinTradeResponse(Double result, Double tradePrice) {
        this.result = result;
        this.tradePrice = tradePrice;
    }
}
