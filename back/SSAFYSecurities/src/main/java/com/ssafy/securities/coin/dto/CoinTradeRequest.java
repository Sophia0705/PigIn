package com.ssafy.securities.coin.dto;

import lombok.Data;

@Data
public class CoinTradeRequest {
    private String coinCode;
    private Double quantity;
}
