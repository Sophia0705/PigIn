package com.ssafy.c203.domain.stock.dto;

import lombok.Data;

@Data
public class StockSellRequest {
    private String stockCode;
    private Double amount;
}
