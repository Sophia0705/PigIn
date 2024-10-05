package com.ssafy.c203.domain.coin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FindCoinPortfolioResponse {
    private String coinCode;
    private String name;
    private Double amount;
    private Double price;
    private Double profitRate;
}
