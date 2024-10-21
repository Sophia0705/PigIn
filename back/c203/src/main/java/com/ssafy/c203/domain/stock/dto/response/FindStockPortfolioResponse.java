package com.ssafy.c203.domain.stock.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FindStockPortfolioResponse {
    private String stockCode;
    private String name;
    private Double amount;
    private Integer price;
    private Double profitRate;
}
