package com.ssafy.c203.domain.coin.controller;

import com.ssafy.c203.domain.coin.dto.request.CoinTradeRequest;
import com.ssafy.c203.domain.coin.dto.response.*;
import com.ssafy.c203.domain.coin.entity.CoinItem;
import com.ssafy.c203.domain.coin.entity.CoinPortfolio;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import com.ssafy.c203.domain.coin.service.CoinEmitterService;
import com.ssafy.c203.domain.coin.service.CoinService;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.stock.dto.PriceAndProfit;
import com.ssafy.c203.domain.stock.dto.response.FindMyStockAllResponse;
import com.ssafy.c203.domain.stock.dto.response.FindStockPortfolioResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        return ResponseEntity.ok().body(new FindCoinPortfolioResponse(coinCode, portfolio.getCoinItem().getName(), portfolio.getAmount(), result.getPrice() * portfolio.getAmount(), result.getProfit()));
    }

    @GetMapping("/my-coins")
    public ResponseEntity<?> findMyStocks(@AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user.getUserId();
//        log.info("findMyCoins: userId = {}", userId);
        List<FindCoinPortfolioResponse> coins = coinService.findCoinPortfolios(userId);

        Double price = Math.round(coins.stream()
                .mapToDouble(FindCoinPortfolioResponse::getPrice)
                .sum() * 100.0) / 100.0;

        return ResponseEntity.ok().body(new FindMyCoinAllResponse(price, coins));
    }

    @PostMapping("/{coinCode}/favorite")
    public ResponseEntity<?> addCoinFavorite(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        Long userId = user.getUserId();
        return ResponseEntity.ok().body(makeResult("result", coinService.addCoinFavorite(userId, coinCode)));
    }

    @DeleteMapping("/{coinCode}/favorite")
    public ResponseEntity<?> deleteCoinFavorite(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        Long userId = user.getUserId();
        coinService.deleteCoinFavorite(userId, coinCode);

        return ResponseEntity.ok().body(makeResult("result", true));
    }

    @GetMapping("/{coinCode}/favorite")
    public ResponseEntity<?> isCoinFavorite(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        Long userId = user.getUserId();
        return ResponseEntity.ok().body(makeResult("result", coinService.isCoinFavorite(userId, coinCode)));
    }

    @GetMapping("/favorite")
    public ResponseEntity<?> findCoinFavorite() {
        List<CoinRecommendResponse> responses = coinService.findRecommendCoin().stream()
                .map(CoinRecommendResponse::new)
                .toList();

        return ResponseEntity.ok().body(responses);
    }

    private Map<String, Boolean> makeResult(String key, Boolean value) {
        Map<String, Boolean> result = new HashMap<>();
        result.put(key, value);
        return result;
    }
}
