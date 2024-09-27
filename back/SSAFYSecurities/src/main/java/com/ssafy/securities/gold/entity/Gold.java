package com.ssafy.securities.gold.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collation = "Gold")
@Getter
@NoArgsConstructor
public class Gold {

    private String date;
    private String srtnCd;
    private String isin;
    private String itemName;
    private String close;
    private String vsYesterday;
    private String upDownRate;
    private String open;
    private String high;
    private String low;
    private String tradeAmount;
    private String tradePrice;

    @Builder
    public Gold(String date, String srtnCd, String isin, String itemName, String close,
        String vsYesterday, String upDownRate, String open, String high, String low,
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
