package com.ssafy.c203.domain.gold.dto.response;

import java.time.LocalDate;
import lombok.Data;

@Data
public class GoldYearDto {

    private LocalDate date;
    private double close;

}
