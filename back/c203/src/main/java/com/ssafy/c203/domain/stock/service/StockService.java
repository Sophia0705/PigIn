package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;

import java.util.List;

public interface StockService {
    public List<MongoStockDetail> findAllStock();
    public List<MongoStockDetail> searchStock(String keyword);
    public MongoStockDetail findStock(String stockCode);
    public List<MongoStockHistory> findStockChart(String stockCode, String interval, Integer count);
}
