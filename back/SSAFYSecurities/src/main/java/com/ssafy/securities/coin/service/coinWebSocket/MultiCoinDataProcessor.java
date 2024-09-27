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
        scheduler.scheduleAtFixedRate(this::processAndSaveData, 0, 10, TimeUnit.SECONDS);
    }

    private void processAndSaveData() {
        latestDataMap.forEach((coinCode, coinMinuteDTO) -> {
            coinDataService.saveCoinData(coinMinuteDTO);

        });
        latestDataMap.clear();
    }

    public void shutdown() {
        scheduler.shutdown();
    }
}