package com.ssafy.securities.gold.dto.response;

import lombok.Data;

@Data
public class GoldYearDto {
    private String month;
    private double close;

    public GoldYearDto(String month, double close) {
        this.month = month;
        this.close = close;
    }
}
