package com.ssafy.securities.gold.dto.response;

import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class GoldDetailDto {
    private LocalDate date;
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
}
