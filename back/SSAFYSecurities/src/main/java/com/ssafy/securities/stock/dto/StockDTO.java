package com.ssafy.securities.stock.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StockDTO {
    private String stockCode;
    private String date;
    private String time;
    private String open;
    private String close;
    private String high;
    private String low;
    private String volume;
    private String change;
}