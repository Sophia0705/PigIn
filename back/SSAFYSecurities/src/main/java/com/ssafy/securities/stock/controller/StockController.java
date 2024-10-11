package com.ssafy.securities.stock.controller;

import com.ssafy.securities.stock.dto.apiRequest.StockTradeRequest;
import com.ssafy.securities.stock.dto.apiResponse.StockTradeResponse;
import com.ssafy.securities.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/stock")
public class StockController {
    private final StockService stockService;

    @PostMapping("/trade/buy")
    public ResponseEntity<?> buyStock(@RequestBody StockTradeRequest request) {
        // 으아아아
        StockTradeResponse response = stockService.buyStock(request.getQuantity(), request.getStockCode());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/trade/sell")
    public ResponseEntity<?> sellStock(@RequestBody StockTradeRequest request) {
        StockTradeResponse response = stockService.sellStock(request.getQuantity(), request.getStockCode());
        return ResponseEntity.ok(response);
    }

}
