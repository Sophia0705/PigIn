package com.ssafy.securities.stock.service;

import com.ssafy.securities.stock.dto.apiResponse.StockTradeResponse;

public interface StockService {

    // 2. 월봉 받아오기
    void getMonthlyBar();

    // 3. 주봉 받아오기
    void getWeeklyBar();

    // 4. 일봉 받아오기
    void getDailyBar();

    StockTradeResponse buyStock(double price, String stockCode);

    StockTradeResponse sellStock(double price, String stockCode);

    void getKospiStockData();
}
