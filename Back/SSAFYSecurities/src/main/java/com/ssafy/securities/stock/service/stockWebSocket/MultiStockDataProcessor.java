package com.ssafy.securities.stock.service.stockWebSocket;

import com.ssafy.securities.stock.dto.StockBarDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class MultiStockDataProcessor {

    private final ConcurrentHashMap<String, StockBarDTO> latestDataMap = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private final StockDataService stockDataService;

    public MultiStockDataProcessor(StockDataService stockDataService) {
        this.stockDataService = stockDataService;
        startScheduler();
    }

    public void handleMessage(String stockCode, StockBarDTO stockData) {
        latestDataMap.put(stockCode, stockData);
    }

    private void startScheduler() {
        scheduler.scheduleAtFixedRate(this::processAndSaveData, 0, 1, TimeUnit.MINUTES);
        log.info("Scheduler started");
    }

    private void processAndSaveData() {
        log.info("Processing data");
        latestDataMap.forEach((stockCode, stockData) -> {
            stockDataService.saveStockData(stockCode, stockData);
            System.out.println("Processed and saved data for stock: " + stockCode);
        });
        latestDataMap.clear();
    }

    public void shutdown() {
        scheduler.shutdown();
    }
}