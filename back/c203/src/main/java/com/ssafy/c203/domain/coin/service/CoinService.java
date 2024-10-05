package com.ssafy.c203.domain.coin.service;

import com.ssafy.c203.domain.coin.dto.response.FindCoinAllResponse;
import com.ssafy.c203.domain.coin.dto.response.FindCoinResponse;
import com.ssafy.c203.domain.coin.entity.CoinPortfolio;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import com.ssafy.c203.domain.stock.dto.response.FindCoinPortfolioResponse;

import java.util.List;

public interface CoinService {

    public List<FindCoinAllResponse> findAllCoins();
    public List<FindCoinAllResponse> searchCoins(String keyword);
    public FindCoinResponse findCoin(String coinCode);
    public List<MongoCoinHistory> findCoinChart(String stockCode, String interval, Integer count);
    public List<MongoCoinMinute> findCoinMinute();
    public List<MongoCoinMinute> findCoinMinuteChart(String stockCode, Integer count);
    public void sellCoin(Long userId, String coinCode, Double price);
    public void buyCoin(Long userId, String coinCode, Double price);
    public CoinPortfolio findCoinPortfolioByCode(Long userId, String coinCode);
    public List<FindCoinPortfolioResponse> findCoinPortfolios(Long userId);
    public Double calculateProfit(Double priceAvg, String coinCode);
}
