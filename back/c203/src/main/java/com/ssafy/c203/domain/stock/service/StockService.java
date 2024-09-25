package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;

import java.util.List;

public interface StockService {
    public List<MongoStockDetail> findAllStock();
    public List<?> searchStock(String keyword);
    public void findStock(String stockCode);
    public List<?> findStockChart();
}
