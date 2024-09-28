package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.domain.stock.dto.FindStockChartAllResponse;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
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
public class StockEmitterService {

    private final StockService stockService;
    // SSE 연결(emitter)을 관리
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Scheduled(fixedRate = 1000) // 1초(1000ms)마다 실행
    public void sendStockUpdates() {
//        log.info("스케줄러 실행");
        List<FindStockChartAllResponse> stockData = getStockData();
        // 제거해야 할 emitter
        List<SseEmitter> deadEmitters = new ArrayList<>();

        // 모든 emitter 대해 반복
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("stock-update").data(stockData));
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

    private List<FindStockChartAllResponse> getStockData() {
        List<MongoStockMinute> stockDetails = stockService.findStockMinute();
//        log.info("stockDetails: {}", stockDetails);
        return stockDetails.stream()
                .map(FindStockChartAllResponse::new)
                .toList();
    }
}