package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;

import java.util.List;

public interface StockService {
    public List<MongoStockDetail> findAllStock();
    public List<MongoStockDetail> searchStock(String keyword);
    public MongoStockDetail findStock(String stockCode);
    public List<MongoStockHistory> findStockChart(String stockCode, String interval, Integer count);
    public List<MongoStockMinute> findStockMinute();
    public List<MongoStockMinute> findStockMinuteChart(String stockCode, Integer count);
}
