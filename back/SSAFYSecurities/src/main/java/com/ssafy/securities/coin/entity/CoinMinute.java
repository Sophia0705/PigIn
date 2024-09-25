package com.ssafy.securities.coin.entity;

import com.ssafy.securities.coin.dto.CoinWebSocketBarDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collation = "coinminute")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoinMinute {

    @Id
    private String id; // [code + date + minute]
    private String coin; // 코인 종류
    private LocalDate date;
    private LocalTime time;
    private Double open;
    private Double close;
    private Double high;
    private Double low;
    private Double volume;

}
