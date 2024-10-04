package com.ssafy.securities.coin.controller;

import com.ssafy.securities.coin.dto.CoinTradeRequest;
import com.ssafy.securities.coin.dto.CoinTradeResponse;
import com.ssafy.securities.coin.service.CoinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/coin")
public class CoinController {
    private final CoinService coinService;

    @PostMapping("/trade/buy")
    public ResponseEntity<?> buyCoin(@RequestBody CoinTradeRequest request) {
        CoinTradeResponse response = coinService.buyCoin(request.getCoinCode(), request.getQuantity());
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/trade/sell")
    public ResponseEntity<?> sellCoin(@RequestBody CoinTradeRequest request) {
        CoinTradeResponse response = coinService.sellCoin(request.getCoinCode(), request.getQuantity());
        return ResponseEntity.ok().body(response);
    }
}
