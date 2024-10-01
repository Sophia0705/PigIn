package com.ssafy.securities.gold.dto.response;

import lombok.Data;

@Data
public class GoldYearDto {
    private int month;
    private double close;

    public GoldYearDto(int month, double close) {
        this.month = month;
        this.close = close;
    }
}
