package com.ssafy.securities.gold.dto.response;

import java.time.LocalDate;
import lombok.Data;

@Data
public class GoldYearDto {
    private LocalDate date;
    private String close;

    public GoldYearDto(LocalDate date, String close) {
        this.date = date;
        this.close = close;
    }
}
