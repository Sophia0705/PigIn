package com.ssafy.securities.gold.entity;


import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Gold")
@Getter
@NoArgsConstructor
public class Gold {

    private LocalDate date;
    private String srtnCd;
    private String isin;
    private String itemName;
    private int close;
    private String vsYesterday;
    private String upDownRate;
    private int open;
    private int high;
    private int low;
    private String tradeAmount;
    private String tradePrice;

    @Builder
    public Gold(LocalDate date, String srtnCd, String isin, String itemName, int close,
        String vsYesterday, String upDownRate, int open, int high, int low,
        String tradeAmount,
        String tradePrice) {
        this.date = date;
        this.srtnCd = srtnCd;
        this.isin = isin;
        this.itemName = itemName;
        this.close = close;
        this.vsYesterday = vsYesterday;
        this.upDownRate = upDownRate;
        this.open = open;
        this.high = high;
        this.low = low;
        this.tradeAmount = tradeAmount;
        this.tradePrice = tradePrice;
    }
}
