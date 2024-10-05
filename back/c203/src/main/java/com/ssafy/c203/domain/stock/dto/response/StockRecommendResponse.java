package com.ssafy.c203.domain.stock.dto.response;

import com.ssafy.c203.domain.stock.entity.StockItem;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockRecommendResponse {
    private String StockCode;
    private String StockName;

    public StockRecommendResponse(StockItem stockItem) {
        this.StockCode = stockItem.getId();
        this.StockName = stockItem.getName();
    }
}
