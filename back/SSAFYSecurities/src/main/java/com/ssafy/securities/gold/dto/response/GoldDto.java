package com.ssafy.securities.gold.dto.response;

import java.time.LocalDate;
import lombok.Data;

@Data
public class GoldDto {
    private LocalDate date;
    private int close;

    public GoldDto(LocalDate date, int close) {
        this.date = date;
        this.close = close;
    }
}
