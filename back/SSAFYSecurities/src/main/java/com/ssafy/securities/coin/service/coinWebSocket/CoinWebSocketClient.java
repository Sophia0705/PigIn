package com.ssafy.securities.coin.service.coinWebSocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.securities.coin.dto.CoinWebSocketBarDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Component
public class CoinWebSocketClient extends TextWebSocketHandler {

    private final AtomicReference<WebSocketSession> sessionRef = new AtomicReference<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void connect(String url) throws Exception {
        WebSocketClient client = new StandardWebSocketClient();

        WebSocketHttpHeaders headers = new WebSocketHttpHeaders();
//        headers.add(HttpHeaders.AUTHORIZATION, token);

        sessionRef.set(client.doHandshake(this, headers, URI.create(url)).get());
        log.info("Coin WebSocket connected successfully");
    }

    public void subscribeStock(List<String> stockCodes) throws Exception {
        WebSocketSession session = sessionRef.get();
//        if (session != null && session.isOpen()) {
        String subscriptionMessage = createSubscriptionMessage(stockCodes);
        session.sendMessage(new TextMessage(subscriptionMessage));
        log.info("Subscribed to stock: {}", stockCodes);
//        } else {
//            log.error("WebSocket session is not open");
//        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            String payload = message.getPayload();
            CoinWebSocketBarDTO stockData = parseCoinData(payload);
            log.info("Received Coin data: {}", stockData);
            // Here you can process the stock data further, e.g., save to database or notify clients
        } catch (Exception e) {
            log.error("Error handling message", e);
        }
    }



    private String createSubscriptionMessage(List<String> stockCodes) throws JsonProcessingException {
        String subMessage = objectMapper.writeValueAsString(List.of(
                Map.of("ticket", UUID.randomUUID().toString()),
                Map.of("type", "ticker", "codes", stockCodes),
                Map.of("format", "DEFAULT")
        ));
        log.info("Subscription message: {}", subMessage);
        return subMessage;
    }

    private CoinWebSocketBarDTO parseCoinData(String payload) throws JsonProcessingException {
        // This is a simplified parsing. Adjust according to the actual data structure.
        Map<String, Object> data = objectMapper.readValue(payload, Map.class);
        return CoinWebSocketBarDTO.builder()
                .code((String) data.get("code"))
                .tradePrice((Double) data.get("trade_price"))
                .tradeVolume((Double) data.get("trade_volume"))
                .timestamp((Long) data.get("timestamp"))
                .build();
    }
}