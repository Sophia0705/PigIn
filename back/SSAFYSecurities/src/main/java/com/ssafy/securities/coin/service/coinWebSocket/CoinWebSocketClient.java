package com.ssafy.securities.coin.service.coinWebSocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.securities.coin.dto.CoinMinuteDTO;
import com.ssafy.securities.stock.service.stockWebSocket.MultiStockDataProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

@Component
@Slf4j
public class CoinWebSocketClient extends AbstractWebSocketHandler {

    private WebSocketSession webSocketSession;
    private final AtomicReference<WebSocketSession> sessionRef = new AtomicReference<>();
    private final MultiCoinDataProcessor dataProcessor;

    public CoinWebSocketClient(MultiCoinDataProcessor dataProcessor) {
        this.dataProcessor = dataProcessor;
    }


    // WebSocket 서버에 연결
    public void connect(String url, List<String> coinCodes) throws Exception {
        StandardWebSocketClient client = new StandardWebSocketClient();
        client.doHandshake(this, url).addCallback(
                session -> {
                    log.info("WebSocket 연결 성공: {}", url);
                    this.webSocketSession = session;
                    try {
                        // 연결 성공 후 구독 메시지 전송
                        subscribeStock(coinCodes);
                    } catch (Exception e) {
                        log.error("구독 요청 중 오류 발생", e);
                    }
                },
                throwable -> log.error("WebSocket 연결 실패", throwable)
        );
    }

    // 코인 종목 구독
    public void subscribeStock(List<String> coinCodes) throws Exception {
        if (webSocketSession == null || !webSocketSession.isOpen()) {
//            log.error("WebSocket 연결이 열려 있지 않습니다.");
            return;
        }

        // 업비트 WebSocket API 구독 메시지 작성 (JSON 형식)
        String subscribeMessage = createSubscribeMessage(coinCodes);
//        log.info("구독 메시지 전송: {}", subscribeMessage);

        log.info(subscribeMessage);
        // 텍스트 메시지로 구독 요청
        webSocketSession.sendMessage(new TextMessage(subscribeMessage));
    }

    // 업비트 WebSocket API에서 받은 이진 메시지 처리
    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        ByteBuffer payload = message.getPayload();
        String jsonData = new String(payload.array());

//        log.info("수신한 JSON 데이터: {}", jsonData);

        try {
            // 메시지 처리 속도 조절
//            if (canProcessMessage()) {
                ObjectMapper objectMapper = new ObjectMapper();
                CoinMinuteDTO coinMinuteDTO = objectMapper.readValue(jsonData, CoinMinuteDTO.class);
                dataProcessor.handleMessage(coinMinuteDTO.getCode(), coinMinuteDTO);
//            } else {
//                log.warn("메시지 처리 속도를 초과했습니다.");
                // 필요 시 적절한 대기 로직 추가
//            }
        } catch (Exception e) {
            log.error("Failed to parse JSON to CoinMinuteDTO", e);
        }
    }


    // 구독 메시지를 JSON 형식으로 생성
    private String createSubscribeMessage(List<String> coinCodes) {
        StringBuilder sb = new StringBuilder();
        sb.append("[{\"ticket\":\"UNIQUE_TICKET\"},");
        sb.append("{\"type\":\"ticker\",\"codes\":[");

        for (int i = 0; i < coinCodes.size(); i++) {
            sb.append("\"").append(coinCodes.get(i)).append("\"");
            if (i < coinCodes.size() - 1) {
                sb.append(",");
            }
        }

        sb.append("]}]");
        return sb.toString();
    }

    // WebSocket 연결 종료
    public void close() throws Exception {
        if (webSocketSession != null && webSocketSession.isOpen()) {
            webSocketSession.close();
            log.info("WebSocket 연결 종료");
        }
    }
}
