package com.ssafy.c203.domain.stock.entity.mongo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "stockhistory")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MongoStockHistory {

    @Id
    private String id; // [code + date]
    private String stockCode;
    private String date;
    private String close; //
    private String open;
    private String high;
    private String low;
    private String volume;
    private String interval;

}
