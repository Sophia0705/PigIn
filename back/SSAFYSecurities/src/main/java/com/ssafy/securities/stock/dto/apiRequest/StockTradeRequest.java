package com.ssafy.securities.stock.dto.apiRequest;

import lombok.Data;

@Data
public class StockTradeRequest {
    private String stockCode;
    private Double quantity;
}
