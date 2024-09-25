package com.ssafy.c203.domain.stock.service;

import java.util.List;

public interface StockService {
    public List<?> findAllStock();
    public List<?> searchStock(String keyword);
    public void findStock(String stockCode);
    public List<?> findStockChart();
}
