package com.ssafy.c203.domain.coin.service;

import com.ssafy.c203.domain.coin.dto.FindCoinAllResponse;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;

import java.util.List;

public interface CoinService {

    public List<FindCoinAllResponse> findAllCoins();
    public List<FindCoinAllResponse> searchCoins(String keyword);
    public List<MongoCoinHistory> searchCoins(String keyword, int page);
    public List<MongoCoinHistory> findCoinChart(String stockCode, String interval, Integer count);
}
