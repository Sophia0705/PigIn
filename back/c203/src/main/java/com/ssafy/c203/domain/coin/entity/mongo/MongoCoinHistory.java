package com.ssafy.c203.domain.coin.entity.mongo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "coinHistory")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MongoCoinHistory {

    @Id
    private String id; // [code + date]
    private String coin; // 코인 종류
    private String date;
    private String open;
    private String close;
    private String high;
    private String low;
    private String volume;
    private String interval;

}
