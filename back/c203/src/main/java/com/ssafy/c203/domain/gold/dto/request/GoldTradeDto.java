package com.ssafy.c203.domain.gold.dto.request;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class GoldTradeDto {
    private int tradePrice;
    private String method;
}
