package com.ssafy.c203.domain.stock.controller;

import com.ssafy.c203.domain.coin.dto.response.FindCoinPortfolioResponse;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.stock.dto.PriceAndProfit;
import com.ssafy.c203.domain.stock.dto.request.StockBuyRequest;
import com.ssafy.c203.domain.stock.dto.request.StockSellRequest;
import com.ssafy.c203.domain.stock.dto.response.*;
import com.ssafy.c203.domain.stock.entity.StockPortfolio;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
import com.ssafy.c203.domain.stock.service.StockEmitterService;
import com.ssafy.c203.domain.stock.service.StockService;
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

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/stock")
public class StockController {

    private final StockService stockService;
    private final StockEmitterService stockEmitterService;

    @GetMapping
    public ResponseEntity<?> findAllStock() {
        List<MongoStockDetail> stockDetails = stockService.findAllStock();
//        log.info("stockDetails = {}", stockDetails);
        List<FindStockAllResponse> response = stockDetails.stream()
                .map(FindStockAllResponse::new)
                .toList();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> findAllStockBySearch(@RequestParam String keyword) {
//        log.info("findAllStockBySearch: keyword = {}", keyword);
        List<MongoStockDetail> stockDetails = stockService.searchStock(keyword);
//        log.info("stockDetails = {}", stockDetails);
        List<FindStockAllResponse> response = stockDetails.stream()
                .map(FindStockAllResponse::new)
                .toList();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{stockId}/chart/{interval}")
    public ResponseEntity<?> findStockChart(@PathVariable String stockId, @PathVariable String interval, @RequestParam Integer count) {
//        log.info("findStockChart: stockId = {}, interval = {} count = {}", stockId, interval, count);
        List<FindStockChartAllResponse> responses;
        if (interval.equals("minute")) {
            List<MongoStockMinute> stockChart = stockService.findStockMinuteChart(stockId, count > 100 ? 100 : count);
            responses = stockChart.stream()
                    .map(FindStockChartAllResponse::new)
                    .toList();
        } else {
            List<MongoStockHistory> stockChart = stockService.findStockChart(stockId, interval, count > 100 ? 100 : count);
            responses = stockChart.stream()
                    .map(FindStockChartAllResponse::new)
                    .toList();
        }
        return ResponseEntity.ok().body(responses);
    }

    @GetMapping("/{stockId}")
    public ResponseEntity<?> findStockById(@PathVariable String stockId) {
//        log.info("findStockById: stockId = {}", stockId);
        FindStockDetailResponse response = new FindStockDetailResponse(stockService.findStockDetail(stockId));
        return ResponseEntity.ok().body(response);
    }

    @GetMapping(value = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamStocks() {
//        log.info("streamStocks");
        return stockEmitterService.addEmitter();
    }

    @PostMapping("/{stockId}/sell")
    public ResponseEntity<?> sellStock(@RequestBody StockSellRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
//        log.info("request = {}", request);
        if (stockService.sellStock(customUserDetails.getUserId(), request.getStockCode(), request.getAmount(), false)) {
            return ResponseEntity.ok().body("success");
        }
        return ResponseEntity.ok().body("wait");
    }

    @PostMapping("/{stockId}/buy")
    public ResponseEntity<?> buyStock(@RequestBody StockBuyRequest request, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
//        log.info("request = {}", request);
        if (stockService.buyStock(customUserDetails.getUserId(), request.getStockCode(), request.getPrice(), false)) {
            log.info("구매 성공");
            return ResponseEntity.ok().body("success");
        }
        return ResponseEntity.ok().body("wait");
    }

    @GetMapping("/{stockId}/quantity")
    public ResponseEntity<?> findStockQuantity(@PathVariable String stockId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
//        log.info("findStockQuantity: stockId = {}", stockId);
        StockPortfolio portfolio = stockService.findStockPortfolioByCode(customUserDetails.getUserId(), stockId);
//        log.info("portfolio = {} : {}", portfolio.getStockItem().getName(), portfolio.getPriceAvg());
        if (portfolio == null) {
            return ResponseEntity.ok().body(new FindStockPortfolioResponse(stockId, stockService.findStockDetail(stockId).getHtsKorIsnm(), 0.0, 0, 0.0));
        }
        PriceAndProfit result = stockService.calculateProfit(portfolio.getPriceAvg(), stockId);
        return ResponseEntity.ok().body(new FindStockPortfolioResponse(stockId, portfolio.getStockItem().getName(), portfolio.getAmount(), (int) Math.floor(result.getPrice() * portfolio.getAmount()), result.getProfit()));
    }

    @GetMapping("/my-stocks")
    public ResponseEntity<?> findMyStocks(@AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user.getUserId();
//        log.info("findMyStocks: userId = {}", userId);
        List<FindStockPortfolioResponse> stocks = stockService.findStockPortfolio(userId);

        Double price = Math.round(stocks.stream()
                .mapToDouble(FindStockPortfolioResponse::getPrice)
                .sum() * 100.0) / 100.0;

        return ResponseEntity.ok().body(new FindMyStockAllResponse(price, stocks));
    }

    @PostMapping("{stockId}/favorite")
    public ResponseEntity<?> addFavoriteStock(@PathVariable String stockId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        stockService.addStockFavorite(userId, stockId);
        return ResponseEntity.ok().body(makeResult("result", true));
    }

    @GetMapping("{stockId}/favorite")
    public ResponseEntity<?> isFavoriteStock(@PathVariable String stockId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        Map<String, Boolean> result = new HashMap<>();
        result.put("result", stockService.isStockFavorite(userId, stockId));

        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("{stockId}/favorite")
    public ResponseEntity<?> deleteFavoriteStock(@PathVariable String stockId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        stockService.deleteStockFavorite(userId, stockId);
        return ResponseEntity.ok().body(makeResult("result", true));
    }

    @GetMapping("/recommend-items")
    public ResponseEntity<?> recommendItems() {
        List<StockRecommendResponse> responses = stockService.findRecommendStock().stream()
                .map(StockRecommendResponse::new)
                .toList();
        return ResponseEntity.ok().body(responses);
    }

    @PostMapping("/{stockId}/auto-funding")
    public ResponseEntity<?> addAutoFunding(@PathVariable String stockId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok().body(makeResult("result", stockService.addAutoFunding(userId, stockId)));
    }

    @DeleteMapping("/{stockId}/auto-funding")
    public ResponseEntity<?> deleteAutoFunding(@PathVariable String stockId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        stockService.deleteAutoFunding(userId, stockId);

        return ResponseEntity.ok().body(makeResult("result", true));
    }

    @GetMapping("/{stockId}/auto-funding")
    public ResponseEntity<?> isAutoFunding(@PathVariable String stockId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok().body(makeResult("result", stockService.isAutoFunding(userId, stockId)));
    }

    @GetMapping("/favorite")
    public ResponseEntity<?> getFavoriteStocks(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestParam Integer count) {
        Long userId = customUserDetails.getUserId();

        List<MongoStockDetail> stockDetails = stockService.findFavoriteStock(userId);
        List<FindStockAllResponse> response = stockDetails.stream()
                .map(FindStockAllResponse::new)
                .limit(count)
                .toList();

        return ResponseEntity.ok().body(response);
    }

//    @PutMapping("/{stockId}/auto-funding")
//    public ResponseEntity<?> setAutoFunding(@PathVariable String stockId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
//        Long userId = customUserDetails.getUserId();
//        return null;
//    }

    private Map<String, Boolean> makeResult(String key, Boolean value) {
        Map<String, Boolean> result = new HashMap<>();
        result.put(key, value);
        return result;
    }
}
