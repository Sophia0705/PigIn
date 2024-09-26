package com.ssafy.c203.domain.stock.dto;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import lombok.Data;

@Data
public class FindStockAllResponse {
    private String stockName;
    private String stockCode;
    private String price;
    private Double priceChange;

    public FindStockAllResponse(MongoStockDetail mongoStockDetail) {
        this.stockName = mongoStockDetail.getHtsKorIsnm();
        this.stockCode = mongoStockDetail.getStckShrnIscd();
        this.price = mongoStockDetail.getStckPrpr();
        this.priceChange = Double.valueOf(mongoStockDetail.getPrdyCtrt());
    }
}
