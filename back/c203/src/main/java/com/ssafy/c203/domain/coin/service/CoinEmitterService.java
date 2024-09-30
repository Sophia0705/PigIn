package com.ssafy.c203.domain.coin.service;

import com.ssafy.c203.domain.coin.dto.FindCoinChartAllResponse;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoinEmitterService {

    private final CoinService coinService;
    // SSE 연결(emitter)을 관리
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Scheduled(fixedRate = 1000) // 1초(1000ms)마다 실행
    public void sendCoinUpdates() {
//        log.info("스케줄러 실행");
        List<FindCoinChartAllResponse> CoinData = getCoinData();
        // 제거해야 할 emitter
        List<SseEmitter> deadEmitters = new ArrayList<>();

        // 모든 emitter 대해 반복
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("Coin-update").data(CoinData));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        });

        emitters.removeAll(deadEmitters);
    }

    public SseEmitter addEmitter() {
        SseEmitter emitter = new SseEmitter(5 * 60 * 1000L);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }

    private List<FindCoinChartAllResponse> getCoinData() {
        List<MongoCoinMinute> CoinDetails = coinService.findCoinMinute();
//        log.info("CoinDetails: {}", CoinDetails);
        return CoinDetails.stream()
                .map(FindCoinChartAllResponse::new)
                .toList();
    }
}