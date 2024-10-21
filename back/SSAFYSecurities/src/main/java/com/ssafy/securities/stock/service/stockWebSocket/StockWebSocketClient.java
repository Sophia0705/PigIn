package com.ssafy.securities.stock.service.stockWebSocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.securities.stock.dto.StockDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Component
public class StockWebSocketClient extends TextWebSocketHandler {

    private final AtomicReference<WebSocketSession> sessionRef = new AtomicReference<>();
    private final MultiStockDataProcessor dataProcessor;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String contentType = "utf-8";
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public StockWebSocketClient(MultiStockDataProcessor dataProcessor) {
        this.dataProcessor = dataProcessor;
    }

    public void connect(String url) throws Exception {
        WebSocketClient client = new StandardWebSocketClient();
        sessionRef.set(client.doHandshake(this, url).get());
    }

    public void subscribeStock(String stockCode, String approvalKey) {
        WebSocketSession session = sessionRef.get();
//        if (session != null && session.isOpen()) {
            try {
                String subscriptionMessage = createSubscriptionMessage(stockCode, approvalKey);
//                log.info("Subscribed to {}", subscriptionMessage);
                session.sendMessage(new TextMessage(subscriptionMessage));
            } catch (Exception e) {
                log.error("Failed to send subscription request for stock: {}", stockCode, e);
            }
//        } else {
//            log.error("WebSocket session is null or closed");
//        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        String payload = message.getPayload();
        try {
            // 메시지 처리 로직 (종목 코드 추출 및 데이터 처리)
            StockDTO stockData = parseStockData(payload);
            String stockCode = extractStockCode(payload); // 이 메서드는 구현 필요
            dataProcessor.handleMessage(stockCode, stockData);
        } catch (Exception e) {
            //log.error("Error processing message: ", e);
        }
    }
    private String createSubscriptionMessage(String stockCode, String approvalKey) throws JsonProcessingException {
        Map<String, Object> header = new HashMap<>();
        header.put("approval_key", approvalKey);
        header.put("custtype", "P");
        header.put("tr_type", "1");
        header.put("content-type", contentType);

        Map<String, Object> input = new HashMap<>();
        input.put("tr_id", "H0STCNT0");
        input.put("tr_key", stockCode);

        Map<String, Object> body = new HashMap<>();
        body.put("input", input);

        Map<String, Object> request = new HashMap<>();
        request.put("header", header);
        request.put("body", body);
        return objectMapper.writeValueAsString(request);
    }
    private StockDTO parseStockData(String payload) {
        // JSON 파싱 로직 구현
        String[] arrValue = payload.split("\\^");
        String[] codes = arrValue[0].split("\\|");

        StockDTO stockDTO =  StockDTO.builder()
                .stockCode(codes[3])
                .date(arrValue[33])
                .time(arrValue[1])
                .open(arrValue[7])
                .close(arrValue[2])
                .high(arrValue[8])
                .low(arrValue[9])
                .volume(arrValue[13])
                .change(arrValue[3])
                .build();
        return stockDTO;
    }

    private String extractStockCode(String payload) {
        String[] arrValue = payload.split("\\^");
        String[] keys = arrValue[0].split("\\|");
        return keys[3];
    }

}