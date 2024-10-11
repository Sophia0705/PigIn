package com.ssafy.c203.domain.coin.controller;

import com.ssafy.c203.common.exception.ExceptionService;
import com.ssafy.c203.common.exception.exceptions.InsufficientAmountException;
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
import com.ssafy.c203.domain.stock.dto.response.FindStockAllResponse;
import com.ssafy.c203.domain.stock.dto.response.FindStockPortfolioResponse;
import com.ssafy.c203.domain.stock.dto.response.StockRecommendResponse;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
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
    private final ExceptionService exceptionService;

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
        return coinEmitterService.addEmitter();
    }

    @PostMapping("/{coinCode}/sell")
    public ResponseEntity<?> sellCoin(@RequestBody CoinTradeRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails) throws InsufficientAmountException {
        exceptionService.UserIdException(customUserDetails);
        coinService.sellCoin(customUserDetails.getUserId(), request.getCoinCode(), request.getPrice());
        return ResponseEntity.ok().body("success");

    }

    @PostMapping("/{coinCode}/buy")
    public ResponseEntity<?> buyCoin(@RequestBody CoinTradeRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        exceptionService.UserIdException(customUserDetails);
        coinService.buyCoin(customUserDetails.getUserId(), request.getCoinCode(), request.getPrice());
        return ResponseEntity.ok().body("success");
    }

    @GetMapping("/{coinCode}/quantity")
    public ResponseEntity<?> findCoinQuantity(@PathVariable String coinCode, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        exceptionService.UserIdException(customUserDetails);
        Long userId = customUserDetails.getUserId();
        CoinPortfolio portfolio = coinService.findCoinPortfolioByCode(userId, coinCode);
        if (portfolio == null) {
            return ResponseEntity.ok().body(new FindCoinPortfolioResponse(coinCode, coinService.findCoin(coinCode).getCoinName(),0.0, 0, 0.0));
        }
        PriceAndProfit result  = coinService.calculateProfit(portfolio.getPriceAvg(), coinCode);
        return ResponseEntity.ok().body(new FindCoinPortfolioResponse(coinCode, portfolio.getCoinItem().getName(), portfolio.getAmount(), (int) Math.floor(result.getPrice() * portfolio.getAmount()), result.getProfit()));
    }

    @GetMapping("/my-coins")
    public ResponseEntity<?> findMyStocks(@AuthenticationPrincipal CustomUserDetails user) {
        exceptionService.UserIdException(user);
        Long userId = user.getUserId();
        List<FindCoinPortfolioResponse> coins = coinService.findCoinPortfolios(userId);

        Double price = Math.round(coins.stream()
                .mapToDouble(FindCoinPortfolioResponse::getPrice)
                .sum() * 100.0) / 100.0;

        return ResponseEntity.ok().body(new FindMyCoinAllResponse(price, coins));
    }

    @PostMapping("/{coinCode}/favorite")
    public ResponseEntity<?> addCoinFavorite(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        exceptionService.UserIdException(user);
        Long userId = user.getUserId();
        return ResponseEntity.ok().body(makeResult("result", coinService.addCoinFavorite(userId, coinCode)));
    }

    @DeleteMapping("/{coinCode}/favorite")
    public ResponseEntity<?> deleteCoinFavorite(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        exceptionService.UserIdException(user);
        Long userId = user.getUserId();
        coinService.deleteCoinFavorite(userId, coinCode);

        return ResponseEntity.ok().body(makeResult("result", true));
    }

    @GetMapping("/{coinCode}/favorite")
    public ResponseEntity<?> isCoinFavorite(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        exceptionService.UserIdException(user);
        Long userId = user.getUserId();
        return ResponseEntity.ok().body(makeResult("result", coinService.isCoinFavorite(userId, coinCode)));
    }

    @GetMapping("/favorite")
    public ResponseEntity<?> findCoinFavorite(@AuthenticationPrincipal CustomUserDetails user, @RequestParam Integer count) {
        exceptionService.UserIdException(user);
        Long userId = user.getUserId();

        List<FindCoinAllResponse> response = coinService.findFavoriteCoin(userId).stream()
                .limit(count)
                .toList();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/recommend-items")
    public ResponseEntity<?> recommendItems() {
        List<CoinRecommendResponse> responses = coinService.findRecommendCoin().stream()
                .map(CoinRecommendResponse::new)
                .toList();
        return ResponseEntity.ok().body(responses);
    }

    @PostMapping("/{coinCode}/auto-funding")
    public ResponseEntity<?> addAutoFunding(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        exceptionService.UserIdException(user);
        Long userId = user.getUserId();
        return ResponseEntity.ok().body(makeResult("result", coinService.addAutoFunding(userId, coinCode)));
    }

    @DeleteMapping("/{coinCode}/auto-funding")
    public ResponseEntity<?> deleteAutoFunding(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        exceptionService.UserIdException(user);
        Long userId = user.getUserId();
        coinService.deleteAutoFunding(userId, coinCode);
        return ResponseEntity.ok().body(makeResult("result", true));
    }

    @GetMapping("/{coinCode}/auto-funding")
    public ResponseEntity<?> isAutoFunding(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String coinCode) {
        exceptionService.UserIdException(user);
        Long userId = user.getUserId();
        return ResponseEntity.ok().body(makeResult("result", coinService.isAutoFunding(userId, coinCode)));
    }

    @GetMapping("/{coinCode}/live")
    public ResponseEntity<?> findCoinNow(@PathVariable String coinCode) {
        FindCoinNowResponse response = coinService.findLiveStock(coinCode);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/rank")
    public ResponseEntity<?> getCoinRank(){
        return ResponseEntity.ok(coinService.getCoinRank());
    }

    private Map<String, Boolean> makeResult(String key, Boolean value) {
        Map<String, Boolean> result = new HashMap<>();
        result.put(key, value);
        return result;
    }
}
