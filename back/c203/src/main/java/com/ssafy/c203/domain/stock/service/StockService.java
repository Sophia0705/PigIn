package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.domain.stock.dto.PriceAndProfit;
import com.ssafy.c203.domain.stock.dto.response.FindStockPortfolioResponse;
import com.ssafy.c203.domain.stock.entity.StockItem;
import com.ssafy.c203.domain.stock.entity.StockPortfolio;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;

import java.util.List;

public interface StockService {
    public List<MongoStockDetail> findAllStock();
    public List<MongoStockDetail> searchStock(String keyword);
    public MongoStockDetail findStockDetail(String stockCode);
    public List<MongoStockHistory> findStockChart(String stockCode, String interval, Integer count);
    public List<MongoStockMinute> findStockMinute();
    public List<MongoStockMinute> findStockMinuteChart(String stockCode, Integer count);
    public boolean buyStock(Long userId, String stockCode, Long price);
    public boolean sellStock(Long userId, String stockCode, Double count);
    public StockPortfolio findStockPortfolioByCode(Long userId, String stockCode);
    public List<FindStockPortfolioResponse> findStockPortfolio(Long userId);
    public PriceAndProfit calculateProfit(Double priceAvg, String stockCode);
    public boolean addStockFavorite(Long userId, String stockCode);
    public boolean isStockFavorite(Long userId, String stockCode);
    public void deleteStockFavorite(Long userId, String stockCode);
    public List<StockItem> findRecommendStock();

    public boolean addAutoFunding(Long userId, String stockCode);
    public boolean isAutoFunding(Long userId, String stockCode);
    public void deleteAutoFunding(Long userId, String stockCode);
    public void setAutoFunding(Long userId, String stockCode, Integer percent);
}

