package com.ssafy.c203.domain.coin.dto;

import lombok.Data;

@Data
public class CoinSellRequest {
    private String coinCode;
    private Double amount;
}
