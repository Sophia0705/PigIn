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
    @Value("${upbit.ACCESSKEY}")
    private String upbitAccessKey;
    @Value("${upbit.SECRETKEY}")
    private String upbitSecretKey;

    @PostConstruct
    public void init() {
        try {
//            coinWebSocketClient.connect(upbitProd, generateToken());\
            coinWebSocketClient.connect(upbitProd);
            subscribeToCoins();

        } catch (Exception e) {
            log.error("Failed to initialize WebSocket connection", e);
        }
    }

    private void subscribeToCoins() {
        try {
            coinWebSocketClient.subscribeStock(coinCodes);
        } catch (Exception e) {
            log.error("Failed to subscribe to stock: {}", coinCodes, e);
        }
    }

//    private String generateToken() {
//        long epochNow = System.currentTimeMillis() / 1000;
//        String jwtToken = Jwts.builder()
//                .claim("access_key", upbitAccessKey)
//                .claim("nonce", UUID.randomUUID().toString())
//                .signWith(SignatureAlgorithm.HS256, upbitSecretKey.getBytes())
//                .compact();
//        return "Bearer " + jwtToken;
//    }
}
