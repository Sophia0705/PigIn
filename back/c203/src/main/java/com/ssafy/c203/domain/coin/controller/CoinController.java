package com.ssafy.c203.domain.coin.controller;

import com.ssafy.c203.domain.coin.dto.FindCoinAllResponse;
import com.ssafy.c203.domain.coin.dto.FindCoinResponse;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import com.ssafy.c203.domain.coin.service.CoinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RequestMapping("/coin")
@RestController
@RequiredArgsConstructor
@Slf4j
public class CoinController {

    private final CoinService coinService;

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
        FindCoinResponse response = new FindCoinResponse(coinService.findCoin(coinCode));
        return ResponseEntity.ok().body(response);
    }

    // 코인 차트 조회
    @GetMapping("/{coinId}/chart/{interval}")
    public ResponseEntity<?> findCoinChart(@PathVariable Long coinId, @PathVariable Integer interval) {

        return null;
    }

    @GetMapping(value = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamCoins() {

        return null;
    }



}
