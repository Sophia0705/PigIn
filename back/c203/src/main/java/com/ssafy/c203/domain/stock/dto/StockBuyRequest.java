package com.ssafy.c203.domain.stock.dto;

import lombok.Data;

@Data
public class StockBuyRequest {
    private String stockCode;
    private Long price;
}
