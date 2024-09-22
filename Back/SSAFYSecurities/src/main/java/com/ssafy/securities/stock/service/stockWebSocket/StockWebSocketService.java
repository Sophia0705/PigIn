package com.ssafy.securities.stock.service.stockWebSocket;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class StockWebSocketService {

    @Value("${stock.websocket.url}")
    private String stockWebsocketUrl;

    @Value("#{'${stock.codes}'.split(',')}")
    private List<String> stockCodes;

    private final StockWebSocketClient webSocketClient;

    public StockWebSocketService(StockWebSocketClient webSocketClient) {
        this.webSocketClient = webSocketClient;
    }

    @PostConstruct
    public void init() {
        try {
            webSocketClient.connect(stockWebsocketUrl);
            subscribeToStocks();
        } catch (Exception e) {
            log.error("Failed to initialize WebSocket connection", e);
        }
    }

    private void subscribeToStocks() {
        stockCodes.forEach(stockCode -> {
            try {
                webSocketClient.subscribeStock(stockCode);
            } catch (Exception e) {
                log.error("Failed to subscribe to stock: {}", stockCode, e);
            }
        });
    }

    public void disconnect() {
        // Implement disconnect logic if needed
    }
}