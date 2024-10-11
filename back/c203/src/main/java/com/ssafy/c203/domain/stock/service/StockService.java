package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.common.exception.exceptions.InsufficientAmountException;
import com.ssafy.c203.domain.stock.dto.PriceAndProfit;
import com.ssafy.c203.domain.stock.dto.StockAutoSetting;
import com.ssafy.c203.domain.stock.dto.response.FindStockNowResponse;
import com.ssafy.c203.domain.stock.dto.response.FindStockPortfolioResponse;
import com.ssafy.c203.domain.stock.dto.response.StockRankDto;
import com.ssafy.c203.domain.stock.entity.StockItem;
import com.ssafy.c203.domain.stock.entity.StockPortfolio;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;

import java.util.List;

public interface StockService {

    List<MongoStockDetail> findAllStock();

    List<MongoStockDetail> searchStock(String keyword);

    MongoStockDetail findStockDetail(String stockCode);

    List<MongoStockHistory> findStockChart(String stockCode, String interval, Integer count);

    List<MongoStockMinute> findStockMinute();

    List<MongoStockMinute> findStockMinuteChart(String stockCode, Integer count);

    boolean buyStock(Long userId, String stockCode, Long price, boolean isAuto);

    boolean sellStock(Long userId, String stockCode, Double count, boolean isAuto) throws InsufficientAmountException;

    StockPortfolio findStockPortfolioByCode(Long userId, String stockCode);

    List<FindStockPortfolioResponse> findStockPortfolio(Long userId);

    PriceAndProfit calculateProfit(Double priceAvg, String stockCode);

    boolean addStockFavorite(Long userId, String stockCode);

    boolean isStockFavorite(Long userId, String stockCode);

    void deleteStockFavorite(Long userId, String stockCode);

    List<StockItem> findRecommendStock();

    boolean addAutoFunding(Long userId, String stockCode);

    boolean isAutoFunding(Long userId, String stockCode);

    void deleteAutoFunding(Long userId, String stockCode);

    void setAutoFunding(Long userId, String stockCode, Integer percent);

    List<MongoStockDetail> findFavoriteStock(Long userId);

    void setStockAutoTrading(Long userId, List<StockAutoSetting> stockAutoSettings);

    List<StockAutoSetting> findStockAutoSetting(Long userId);

    FindStockNowResponse findLiveStock(String stockCode);

    List<StockRankDto> getStockRank();
}

