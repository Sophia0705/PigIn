package com.ssafy.securities.coin.service;

import com.ssafy.securities.stock.service.StockService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CoinServiceTest {

    @Autowired
    private CoinService coinService;

    @Test
    void getAccessToken() {
        // given

        // when
        String bar = coinService.getBar("KRW-BTC", "months", "200").toString();
        // then
        System.out.println("bar = " + bar);

    }
}