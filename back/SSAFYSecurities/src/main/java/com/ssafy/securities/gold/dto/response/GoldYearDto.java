package com.ssafy.securities.gold.dto.response;

import java.time.LocalDate;
import lombok.Data;

@Data
public class GoldYearDto {
    private LocalDate date;
    private double close;

    public GoldYearDto(LocalDate date, double close) {
        this.date = date;
        this.close = close;
    }
}
