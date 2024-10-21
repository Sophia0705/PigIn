package com.ssafy.securities.stock.entity;

import com.ssafy.securities.stock.dto.StockDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "stockMinute")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMinute {

    @Id
    private String id; // [code + date + minute]
    private String stockCode;
    private String date;
    private String time;
    private String close; //
    private String open;
    private String high;
    private String low;
    private String volume;
    private String change;

    public StockMinute(StockDTO dto) {
        this.stockCode = dto.getStockCode();
        this.date = dto.getDate();
        this.time = dto.getTime();
        this.close = dto.getClose();
        this.open = dto.getOpen();
        this.high = dto.getHigh();
        this.low = dto.getLow();
        this.volume = dto.getVolume();
        this.change = dto.getChange();
    }
}
