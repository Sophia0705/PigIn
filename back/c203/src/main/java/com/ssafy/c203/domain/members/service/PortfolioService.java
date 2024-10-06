package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.coin.dto.CoinAutoSetting;
import com.ssafy.c203.domain.coin.dto.response.FindCoinPortfolioResponse;
import com.ssafy.c203.domain.coin.service.CoinService;
import com.ssafy.c203.domain.gold.dto.response.FindGoldPortfolioResponse;
import com.ssafy.c203.domain.gold.service.GoldService;
import com.ssafy.c203.domain.members.dto.AutoTradingSetting;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserPortfolioResponse;
import com.ssafy.c203.domain.members.entity.AutoFundingStatus;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.stock.dto.StockAutoSetting;
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
    private final MemberService memberService;

    @Transactional(readOnly = true)
    public UserPortfolioResponse findPortfolio(Long userId) {

        List<FindStockPortfolioResponse> stocks = stockService.findStockPortfolio(userId);
        List<FindCoinPortfolioResponse> coins = coinService.findCoinPortfolios(userId);
        List<FindGoldPortfolioResponse> gold = new LinkedList<>();

        FindGoldPortfolioResponse goldPortfolio = goldService.findPortfolio(userId);
        double goldPrice = 0.0;

        Double stockPrice = Math.round(stocks.stream()
                .mapToDouble(FindStockPortfolioResponse::getPrice)
                .sum() * 100.0) / 100.0;

        Double coinPrice = Math.round(coins.stream()
                .mapToDouble(FindCoinPortfolioResponse::getPrice)
                .sum() * 100.0) / 100.0;

        if (goldPortfolio != null) {
            gold.add(goldPortfolio);
            goldPrice = Math.round(goldPortfolio.getPrice() * 100.0) / 100.0;
        }

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

    public void updateAutoTrading(Long userId, boolean autoTrading, int price) {
        memberService.updateAutoTrading(userId, autoTrading, price);
    }

    public void updateStockAutoTrading(Long userId, List<StockAutoSetting> autoSettings) {
        stockService.setStockAutoTrading(userId, autoSettings);
    }

    public void updateCoinAutoTrading(Long userId, List<CoinAutoSetting> autoSettings) {
        coinService.updateAutoFunding(userId, autoSettings);
    }

    public void updateGoldAutoTrading(Long userId, int percent) {
        boolean flag = goldService.isAutoFundingGold(userId);
        if (percent == 0 && flag) {
            log.info("delete");
            goldService.cancelFavoriteGold(userId);
        } else if (percent != 0) {
            log.info("update");
            goldService.setAutoFunding(userId, percent);
        }
    }


    public AutoTradingSetting findAutoTrading(Long userId) {
        AutoTradingSetting autoTradingSetting = new AutoTradingSetting();
        Members user = memberService.findMemberById(userId);
        autoTradingSetting.setIsEnabled(user.getAutoFundingStatus() == AutoFundingStatus.ACTIVE);
        autoTradingSetting.setInvestmentAmount(user.getSavingAmount());
        autoTradingSetting.setGolds(goldService.findAutoSetting(userId));
        autoTradingSetting.setCoins(coinService.findAutoFunding(userId));
        autoTradingSetting.setStocks(stockService.findStockAutoSetting(userId));

        return autoTradingSetting;
    }
}
