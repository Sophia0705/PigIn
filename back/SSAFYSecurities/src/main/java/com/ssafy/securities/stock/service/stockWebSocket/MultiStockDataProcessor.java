package com.ssafy.securities.stock.service.stockWebSocket;

import com.ssafy.securities.stock.dto.StockDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class MultiStockDataProcessor {

    private final ConcurrentHashMap<String, StockDTO> latestDataMap = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private final StockDataService stockDataService;

    public MultiStockDataProcessor(StockDataService stockDataService) {
        this.stockDataService = stockDataService;
        startScheduler();
    }

    public void handleMessage(String stockCode, StockDTO stockData) {
        latestDataMap.put(stockCode, stockData);
    }

    private void startScheduler() {
        scheduler.scheduleAtFixedRate(this::processAndSaveData, 0, 10, TimeUnit.SECONDS);
        log.info("Scheduler started");
    }

    private void processAndSaveData() {
        log.info("Processing date:{}[{}]", LocalDate.now(), LocalTime.now());
        log.info("====================================================================");
        latestDataMap.forEach((stockCode, stockData) -> {
            System.out.println("Processed and saved data for stock: " + stockCode);
            stockDataService.saveStockData(stockData);

        });
        latestDataMap.clear();
        log.info("====================================================================");
    }

    public void shutdown() {
        scheduler.shutdown();
    }
}