package com.ssafy.securities.gold.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GoldItemDto {

    @JsonProperty("basDt")
    private LocalDate date;
    private String srtnCd;
    @JsonProperty("isinCd")
    private String isin;
    @JsonProperty("itmsNm")
    private String itemName;
    @JsonProperty("dpr")
    private int close;
    @JsonProperty("vs")
    private String vsYesterday;
    @JsonProperty("fltRt")
    private String upDownRate;
    @JsonProperty("mkp")
    private int open;
    @JsonProperty("hipr")
    private int high;
    @JsonProperty("lopr")
    private int low;
    @JsonProperty("trqu")
    private String tradeAmount;
    @JsonProperty("trPrc")
    private String tradePrice;
}
