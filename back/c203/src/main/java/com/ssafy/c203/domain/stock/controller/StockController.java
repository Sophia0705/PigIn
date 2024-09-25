package com.ssafy.c203.domain.stock.controller;

import com.ssafy.c203.domain.stock.dto.FindStockAllResponse;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/stock")
public class StockController {

    private final StockService stockService;

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
        log.info("keyword = {}", keyword);
        List<MongoStockDetail> stockDetails = stockService.searchStock(keyword);
        log.info("stockDetails = {}", stockDetails);
        List<FindStockAllResponse> response = stockDetails.stream()
                .map(FindStockAllResponse::new)
                .toList();
        return ResponseEntity.ok().body(response);
    }

    
}
