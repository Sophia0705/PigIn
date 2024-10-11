package com.ssafy.c203.domain.gold.dto.response;

import lombok.Data;

@Data
public class FindGoldPortfolioResponse {
    private String name;
    private Double quantity;
    private Double price;
    private Double profitRate;

    public FindGoldPortfolioResponse(Double quantity, Double price, Double profitRate) {
        this.name = "골드바 1kg";
        this.quantity = quantity;
        this.price = price;
        this.profitRate = profitRate;
    }
}
