package com.ssafy.securities.stock.entity;

import com.ssafy.securities.stock.dto.KospiHistoryDTO;
import com.ssafy.securities.stock.dto.apiResponse.StockDataDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "stockHistory")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockHistory {

    @Id
    private String id; // [code + date]
    private String stockCode;
    private String date;
    private String close; //
    private String open;
    private String high;
    private String low;
    private String volume;
    private String interval;

    public StockHistory(StockDataDTO dto, String stockCode, String interval) {
        this.stockCode = stockCode; // stockCode는 외부에서 제공받아야 합니다.
        this.interval = interval;
        this.date = dto.getStockBusinessDate();
        this.open = String.valueOf(dto.getStockOpeningPrice());
        this.high = String.valueOf(dto.getStockHighPrice());
        this.low = String.valueOf(dto.getStockLowPrice());
        this.close = String.valueOf(dto.getStockClosingPrice());
        this.volume = String.valueOf(dto.getAccumulatedVolume());
    }

    public StockHistory(KospiHistoryDTO dto) {

        this.stockCode = "0001";
        this.date = dto.getTradingDate();
        this.close = dto.getClosingPrice().toString();
        this.open = dto.getOpeningPrice().toString();
        this.high = dto.getHighPrice().toString();
        this.low = dto.getLowPrice().toString();
        this.volume = dto.getAccumulatedVolume().toString();
        this.interval = "D";
    }

}
