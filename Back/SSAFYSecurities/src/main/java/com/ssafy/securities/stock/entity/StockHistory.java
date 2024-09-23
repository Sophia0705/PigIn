package com.ssafy.securities.stock.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collation = "stockhistory")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockHistory {

    @Id
    private String id;
    private String stockCode;
    private LocalDate stckBsopDate;
    private Integer stckClpr;
    private Integer stckOprc;
    private Integer stckHgpr;
    private Integer stckLwpr;
    private Integer acmlVol;
    private Integer prdyVrss;
}
