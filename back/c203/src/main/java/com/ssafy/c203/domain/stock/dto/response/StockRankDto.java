package com.ssafy.c203.domain.stock.dto.response;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StockRankDto {

    private String stockItemId; // stockItem.id에 해당하는 필드
    private String stockItemName; // stockItem.name에 해당하는 필드

    public StockRankDto(String stockItemId, String stockItemName) {
        this.stockItemId = stockItemId;
        this.stockItemName = stockItemName;
    }
}
