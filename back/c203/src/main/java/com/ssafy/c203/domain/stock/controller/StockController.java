package com.ssafy.c203.domain.stock.controller;

import com.ssafy.c203.domain.stock.dto.FindStockAllResponse;
import com.ssafy.c203.domain.stock.dto.FindStockChartAllResponse;
import com.ssafy.c203.domain.stock.dto.FindStockDetailResponse;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
import com.ssafy.c203.domain.stock.service.StockEmitterService;
import com.ssafy.c203.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

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
        log.info("stockDetails = {}", stockDetails);
        List<FindStockAllResponse> response = stockDetails.stream()
                .map(FindStockAllResponse::new)
                .toList();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> findAllStockBySearch(@RequestParam String keyword) {
        log.info("findAllStockBySearch: keyword = {}", keyword);
        List<MongoStockDetail> stockDetails = stockService.searchStock(keyword);
        log.info("stockDetails = {}", stockDetails);
        List<FindStockAllResponse> response = stockDetails.stream()
                .map(FindStockAllResponse::new)
                .toList();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{stockId}/chart/{interval}")
    public ResponseEntity<?> findStockChart(@PathVariable String stockId, @PathVariable String interval, @RequestParam Integer count) {
        log.info("findStockChart: stockId = {}, interval = {} count = {}", stockId, interval, count);
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
        log.info("findStockById: stockId = {}", stockId);
        FindStockDetailResponse response = new FindStockDetailResponse(stockService.findStock(stockId));
        return ResponseEntity.ok().body(response);
    }

    @GetMapping(value = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamStocks() {
//        log.info("streamStocks");
        return stockEmitterService.addEmitter();
    }

}
