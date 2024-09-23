package com.ssafy.securities.stock.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collation = "stockrealtime")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockRealtime {

    @Id
    private String id;
    private String stockCode;
    private LocalDate stckBsopDate;
    private LocalTime stckOpDate;
    private Integer stckClpr;
    private Integer stckOprc;
    private Integer stckHgpr;
    private Integer stckLwpr;
    private Integer acmlVol;
    private Integer prdyVrss;
}
