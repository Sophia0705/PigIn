package com.ssafy.c203.domain.gold.dto.response;

import java.time.LocalDate;
import lombok.Data;

@Data
public class GoldDto {

    private LocalDate date;
    private String close;
}
