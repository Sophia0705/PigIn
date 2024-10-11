package com.ssafy.c203.domain.coin.service;

import com.ssafy.c203.common.exception.exceptions.InsufficientAmountException;
import com.ssafy.c203.domain.coin.dto.CoinAutoSetting;
import com.ssafy.c203.domain.coin.dto.response.*;
import com.ssafy.c203.domain.coin.entity.CoinItem;
import com.ssafy.c203.domain.coin.entity.CoinPortfolio;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import com.ssafy.c203.domain.stock.dto.PriceAndProfit;

import java.util.List;

public interface CoinService {

    List<FindCoinAllResponse> findAllCoins();

    List<FindCoinAllResponse> searchCoins(String keyword);

    FindCoinResponse findCoin(String coinCode);

    List<MongoCoinHistory> findCoinChart(String stockCode, String interval, Integer count);

    List<MongoCoinMinute> findCoinMinute();

    List<MongoCoinMinute> findCoinMinuteChart(String stockCode, Integer count);

    void sellCoin(Long userId, String coinCode, Double price) throws InsufficientAmountException;

    void buyCoin(Long userId, String coinCode, Double price);

    CoinPortfolio findCoinPortfolioByCode(Long userId, String coinCode);

    List<FindCoinPortfolioResponse> findCoinPortfolios(Long userId);

    PriceAndProfit calculateProfit(Double priceAvg, String coinCode);

    boolean addCoinFavorite(Long userId, String coinCode);

    boolean isCoinFavorite(Long userId, String coinCode);

    void deleteCoinFavorite(Long userId, String coinCode);

    List<CoinItem> findRecommendCoin();

    boolean addAutoFunding(Long userId, String coinCode);

    boolean isAutoFunding(Long userId, String coinCode);

    void deleteAutoFunding(Long userId, String coinCode);

    void setAutoFunding(Long userId, String coinCode, Integer percent);

    List<FindCoinAllResponse> findFavoriteCoin(Long userId);

    void updateAutoFunding(Long userId, List<CoinAutoSetting> autoSettings);

    List<CoinAutoSetting> findAutoFunding(Long userId);

    FindCoinNowResponse findLiveStock(String coinCode);

    List<CoinRankDto> getCoinRank();
}
