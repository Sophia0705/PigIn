package com.ssafy.c203.domain.coin.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CoinServiceImplTest {

    @Autowired
    private CoinService coinService;

    @Test
    void findCoinPortfolios() {
        System.out.println(coinService.findCoinPortfolios(2L));
    }
}