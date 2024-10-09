package com.ssafy.securities.coin.service.coinWebSocket;

import com.ssafy.securities.coin.dto.CoinMinuteDTO;
import com.ssafy.securities.stock.dto.StockDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class MultiCoinDataProcessor {

    private final ConcurrentHashMap<String, CoinMinuteDTO> latestDataMap = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private final CoinDataService coinDataService;

    public MultiCoinDataProcessor(CoinDataService coinDataService) {
        this.coinDataService = coinDataService;
        startScheduler();
    }

    public void handleMessage(String coinCode, CoinMinuteDTO coinMinuteDTO) {
        latestDataMap.put(coinCode, coinMinuteDTO);
    }

    private void startScheduler() {
        scheduler.scheduleAtFixedRate(this::processAndSaveData, 0, 1, TimeUnit.MINUTES);
    }

    private void processAndSaveData() {
//        log.info("Processing data... {}", latestDataMap.size());
        latestDataMap.forEach((coinCode, coinMinuteDTO) -> {
//            log.info("Processing data for coinCode: {} = {}", coinCode, coinMinuteDTO);
            coinDataService.saveCoinData(coinMinuteDTO);
        });
        latestDataMap.clear();
    }

    public void shutdown() {
        scheduler.shutdown();
    }
}