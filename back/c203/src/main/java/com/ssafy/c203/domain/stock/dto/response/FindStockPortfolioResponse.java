package com.ssafy.c203.domain.stock.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FindStockPortfolioResponse {
    private String stockCode;
    private Double amount;
    private Double profit;

}
