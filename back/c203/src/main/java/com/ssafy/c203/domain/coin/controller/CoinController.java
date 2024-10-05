package com.ssafy.c203.domain.coin.controller;

import com.ssafy.c203.domain.coin.dto.request.CoinTradeRequest;
import com.ssafy.c203.domain.coin.dto.response.FindCoinAllResponse;
import com.ssafy.c203.domain.coin.dto.response.FindCoinChartAllResponse;
import com.ssafy.c203.domain.coin.dto.response.FindCoinPortfolioResponse;
import com.ssafy.c203.domain.coin.dto.response.FindCoinResponse;
import com.ssafy.c203.domain.coin.entity.CoinPortfolio;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import com.ssafy.c203.domain.coin.service.CoinEmitterService;
import com.ssafy.c203.domain.coin.service.CoinService;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.stock.dto.PriceAndProfit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RequestMapping("/coin")
@RestController
@RequiredArgsConstructor
@Slf4j
public class CoinController {

    private final CoinService coinService;
    private final CoinEmitterService coinEmitterService;

    // 코인 리스트 조회
    @GetMapping()
    public ResponseEntity<?> findAllCoin() {
        List<FindCoinAllResponse> responses = coinService.findAllCoins();
        return ResponseEntity.ok().body(responses);
    }

    // 코인 종목 검색
    @GetMapping("/search")
    public ResponseEntity<?> findCoinByName(@RequestParam String keyword) {
        List<FindCoinAllResponse> responses = coinService.searchCoins(keyword);
        return ResponseEntity.ok().body(responses);
    }

    // 코인 상세 조회
    @GetMapping("/{coinCode}")
    public ResponseEntity<?> findCoinById(@PathVariable String coinCode) {
        FindCoinResponse response = coinService.findCoin(coinCode);
        return ResponseEntity.ok().body(response);
    }

    // 코인 차트 조회
    @GetMapping("/{coinCode}/chart/{interval}")
    public ResponseEntity<?> findCoinChart(@PathVariable String coinCode, @PathVariable String interval, @RequestParam Integer count) {

        List<FindCoinChartAllResponse> responses;
        if (interval.equals("minute")) {
            List<MongoCoinMinute> coinChart = coinService.findCoinMinuteChart(coinCode, count > 100 ? 100 : count);
            responses = coinChart.stream()
                    .map(FindCoinChartAllResponse::new)
                    .toList();
        } else {
            List<MongoCoinHistory> stockChart = coinService.findCoinChart(coinCode, interval + "s", count > 100 ? 100 : count);
            responses = stockChart.stream()
                    .map(FindCoinChartAllResponse::new)
                    .toList();
        }
        return ResponseEntity.ok().body(responses);
    }

    @GetMapping(value = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamCoins() {
//        log.info("streamStocks");
        return coinEmitterService.addEmitter();
    }

    @PostMapping("/{coinCode}/sell")
    public ResponseEntity<?> sellCoin(@RequestBody CoinTradeRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        log.info("request = {}", request);
        coinService.sellCoin(customUserDetails.getUserId(), request.getCoinCode(), request.getPrice());
        return ResponseEntity.ok().body("success");

    }

    @PostMapping("/{coinCode}/buy")
    public ResponseEntity<?> buyCoin(@RequestBody CoinTradeRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        log.info("request = {}", request);
        coinService.buyCoin(customUserDetails.getUserId(), request.getCoinCode(), request.getPrice());
        return ResponseEntity.ok().body("success");
    }

    @GetMapping("/{coinCode}/quantity")
    public ResponseEntity<?> findCoinQuantity(@PathVariable String coinCode, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        log.info("userId = {}, coinCode = {}", userId, coinCode);
        CoinPortfolio portfolio = coinService.findCoinPortfolioByCode(userId, coinCode);
        if (portfolio == null) {
            return ResponseEntity.ok().body(new FindCoinPortfolioResponse(coinCode, coinService.findCoin(coinCode).getCoinName(),0.0, 0.0, 0.0));
        }
        PriceAndProfit result  = coinService.calculateProfit(portfolio.getPriceAvg(), coinCode);
        return ResponseEntity.ok().body(new FindCoinPortfolioResponse(coinCode, portfolio.getCoinItem().getName(), result.getPrice() * portfolio.getAmount(), portfolio.getAmount(), result.getProfit()));
    }
}
