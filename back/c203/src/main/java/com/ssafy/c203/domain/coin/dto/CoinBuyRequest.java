package com.ssafy.c203.domain.coin.dto;

import lombok.Data;

@Data
public class CoinBuyRequest {
    private String coinCode;
    private Long price;
}
