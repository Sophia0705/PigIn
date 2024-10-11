package com.ssafy.c203.domain.stock.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class StockServiceImplTest {

    @Autowired
    private StockService stockService;

    @Test
    void findStockPortfolio() {
        System.out.println(stockService.findStockPortfolio(2L));
    }
}