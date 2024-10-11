package com.ssafy.c203.domain.coin.dto.response;

import lombok.Data;

@Data
public class CoinRankDto {

    private String CoinItemId;
    private String CoinItemName;

    public CoinRankDto(String coinItemId, String coinItemName) {
        CoinItemId = coinItemId;
        CoinItemName = coinItemName;
    }
}
