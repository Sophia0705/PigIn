package com.ssafy.c203.domain.stock.dto;

import com.ssafy.c203.domain.coin.entity.CoinAutoFunding;
import com.ssafy.c203.domain.stock.entity.StockAutoFunding;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockAutoSetting {
    private String stockCode;
    private String stockName;
    private Integer percent;

    public StockAutoSetting(StockAutoFunding stockAutoFunding) {
        this.stockCode = stockAutoFunding.getStockItem().getId();
        this.stockName = stockAutoFunding.getStockItem().getName();
        this.percent = stockAutoFunding.getRate();
    }
}
