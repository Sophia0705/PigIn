package com.ssafy.securities.stock.dto.apiResponse;

import lombok.Data;

@Data
public class StockTradeResponse {
    private Double result;
    private Double tradePrice;

    public StockTradeResponse(Double result, Double tradePrice) {
        this.result = result;
        this.tradePrice = tradePrice;
    }
}
