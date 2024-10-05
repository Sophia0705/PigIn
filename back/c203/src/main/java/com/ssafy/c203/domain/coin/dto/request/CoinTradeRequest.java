package com.ssafy.c203.domain.coin.dto.request;

import lombok.Data;

@Data
public class CoinTradeRequest {
    private String coinCode;
    private Double price;
}
