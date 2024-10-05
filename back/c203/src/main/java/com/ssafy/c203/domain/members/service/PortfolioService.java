package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.coin.dto.response.FindCoinPortfolioResponse;
import com.ssafy.c203.domain.coin.service.CoinService;
import com.ssafy.c203.domain.gold.dto.response.FindGoldPortfolioResponse;
import com.ssafy.c203.domain.gold.service.GoldService;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserPortfolioResponse;
import com.ssafy.c203.domain.stock.dto.response.FindStockPortfolioResponse;
import com.ssafy.c203.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PortfolioService {

    private final StockService stockService;
    private final CoinService coinService;
    private final GoldService goldService;

    @Transactional(readOnly = true)
    public UserPortfolioResponse findPortfolio(Long userId) {

        List<FindStockPortfolioResponse> stocks = stockService.findStockPortfolio(userId);
        List<FindCoinPortfolioResponse> coins = coinService.findCoinPortfolios(userId);
        List<FindGoldPortfolioResponse> gold = new LinkedList<>();
        FindGoldPortfolioResponse goldPortfolio = goldService.findPortfolio(userId);
        gold.add(goldPortfolio);

        Double stockPrice = Math.round(stocks.stream()
                .mapToDouble(FindStockPortfolioResponse::getPrice)
                .sum() * 100.0) / 100.0;

        Double coinPrice = Math.round(coins.stream()
                .mapToDouble(FindCoinPortfolioResponse::getPrice)
                .sum() * 100.0) / 100.0;

        Double goldPrice = Math.round(goldPortfolio.getPrice() * 100.0) / 100.0;

        Double total = stockPrice + coinPrice + goldPrice;

        return UserPortfolioResponse.builder()
                .stockPrice(stockPrice)
                .cryptoPrice(coinPrice)
                .goldPrice(goldPrice)
                .totalPrice(total)
                .stocks(stocks)
                .cryptocurrencies(coins)
                .gold(gold)
                .build();
    }
}
