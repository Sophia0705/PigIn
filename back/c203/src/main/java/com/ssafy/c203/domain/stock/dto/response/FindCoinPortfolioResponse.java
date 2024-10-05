package com.ssafy.c203.domain.stock.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FindCoinPortfolioResponse {
    private String coinCode;
    private Double amount;
    private Double profit;
}
