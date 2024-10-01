package com.ssafy.c203.domain.coin.dto;

import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import lombok.Data;

import java.util.HashMap;

@Data
public class FindCoinAllResponse {

    private String coinName;
    private String coin;
    private String price;
    private Double priceChange;

    public FindCoinAllResponse(MongoCoinMinute mongoCoinMinute, HashMap<String, String> coinMap) {
        this.coin = mongoCoinMinute.getCoin();
        this.price = mongoCoinMinute.getClose().toString();
        this.priceChange = mongoCoinMinute.getChangePrice();
        this.coinName = coinMap.get(this.coin);
    }
}
