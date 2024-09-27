package com.ssafy.securities.coin.service.coinWebSocket;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoinWebSocketService {

    private final CoinWebSocketClient coinWebSocketClient;

    @Value("${upbit.WEBSOCKET.PROD}")
    private String upbitProd;
    @Value("#{'${upbit.codes}'.split(',')}")
    private List<String> coinCodes;

    @PostConstruct
    public void init() {
        try {
            log.info("Connecting to upbit...");
            coinWebSocketClient.connect(upbitProd, coinCodes);

        } catch (Exception e) {
            log.error("Failed to initialize WebSocket connection", e);
        }
    }

}
