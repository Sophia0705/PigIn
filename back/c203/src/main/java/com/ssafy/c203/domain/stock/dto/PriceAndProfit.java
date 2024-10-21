package com.ssafy.c203.domain.stock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PriceAndProfit {
    private double price;
    private double profit;
}
