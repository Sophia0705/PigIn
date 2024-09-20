package com.ssafy.securities.stock.service.stockWebSocket;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockWebSocketService {

    @Value("${stock.websocket.url}")
    private String stockWebsocketUrl;

    @Value("#{'${stock.codes}'.split(',')}")
    private List<String> stockCodes;

    private final MultiStockDataProcessor dataProcessor;
    private final ConcurrentHashMap<String, StockWebSocketClient> clients = new ConcurrentHashMap<>();

    public StockWebSocketService(MultiStockDataProcessor dataProcessor) {
        this.dataProcessor = dataProcessor;
    }

    @PostConstruct
    public void init() {
        stockCodes.forEach(this::connectToStockWebSocket);
    }

    private void connectToStockWebSocket(String stockCode) {
        try {
            StockWebSocketClient client = new StockWebSocketClient(stockCode, dataProcessor);
            client.connect(stockWebsocketUrl);
            clients.put(stockCode, client);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}