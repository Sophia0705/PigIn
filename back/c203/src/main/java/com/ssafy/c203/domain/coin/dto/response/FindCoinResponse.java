package com.ssafy.c203.domain.coin.dto.response;

import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import lombok.Data;

@Data
public class FindCoinResponse {

    private String coin; // 코인 종류
    private String coinName; // 코인 이름
    private String date;
    private Double open;
    private Double close;
    private Double high;
    private Double low;
    private Double volume;

    public FindCoinResponse(MongoCoinMinute mongoCoinMinute, String coinName) {
        this.coin = mongoCoinMinute.getCoin();
        this.coinName = coinName;
        this.date = mongoCoinMinute.getDate().toString().replace("-", "");
        this.open = mongoCoinMinute.getOpen();
        this.close = mongoCoinMinute.getClose();
        this.high = mongoCoinMinute.getHigh();
        this.low = mongoCoinMinute.getLow();
        this.volume = mongoCoinMinute.getVolume();
    }

//    // JS 지수 변환 불가 시
//    public FindCoinResponse(MongoCoinMinute mongoCoinMinute) {
//        this.coin = mongoCoinMinute.getCoin();
//        this.date = mongoCoinMinute.getDate().toString().replace("-", "");
//        this.open = formatValue(mongoCoinMinute.getOpen());
//        this.close = formatValue(mongoCoinMinute.getClose());
//        this.high = formatValue(mongoCoinMinute.getHigh());
//        this.low = formatValue(mongoCoinMinute.getLow());
//        this.volume = mongoCoinMinute.getVolume();
//    }
//
//    private String formatValue(Double value) {
//        if (value == null) return null;
//        return df.format(new BigDecimal(value.toString()));
//    }

}
