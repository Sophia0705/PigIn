package com.ssafy.securities.stock.service.webSocketx;

import org.junit.jupiter.api.Test;

class WebSocketOpsTest {

    private WebSocketOps webSocketOps;

    @Test
    void send() {
        webSocketOps = new WebSocketOps();
        webSocketOps.connectWebSocket();
    }

}