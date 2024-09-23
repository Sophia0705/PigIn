package com.ssafy.securities.stock.service.stockWebSocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class StockWebSocketService {

    @Value("${stock.websocket.url}")
    private String stockWebsocketUrl;
    @Value("#{'${stock.codes}'.split(',')}")
    private List<String> stockCodes;
    @Value("${koreainvestment.PROD}")
    private String koreainvestmentProd;
    @Value("${koreainvestment.APPSECRET}")
    private String appSecret;
    @Value("${koreainvestment.APPKEY}")
    private String appKey;

    private final StockWebSocketClient webSocketClient;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public StockWebSocketService(StockWebSocketClient webSocketClient) {
        this.webSocketClient = webSocketClient;
    }

    @PostConstruct
    public void init() {
        try {
            webSocketClient.connect(stockWebsocketUrl);
            scheduler.scheduleAtFixedRate(this::subscribeToStocks, 0, 1, TimeUnit.HOURS);
        } catch (Exception e) {
            log.error("Failed to initialize WebSocket connection", e);
        }
    }

    private void subscribeToStocks() {
        stockCodes.forEach(stockCode -> {
            try {
                webSocketClient.subscribeStock(stockCode, getApprovalKey());
            } catch (Exception e) {
                log.error("Failed to subscribe to stock: {}", stockCode, e);
            }
        });
    }

    private String getApprovalKey() {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("content-type", "application/json");

        Map<String, String> body = new HashMap<>();
        body.put("grant_type", "client_credentials");
        body.put("appkey", appKey);
        body.put("secretkey", appSecret);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                koreainvestmentProd + "/oauth2/Approval",
                HttpMethod.POST,
                entity,
                Map.class
        );

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, String> responseBody = response.getBody();
            return responseBody.get("approval_key");
        } else {
            throw new RuntimeException("Failed to get approval key");
        }
    }

    public void disconnect() {
        // Implement disconnect logic if needed
    }
}