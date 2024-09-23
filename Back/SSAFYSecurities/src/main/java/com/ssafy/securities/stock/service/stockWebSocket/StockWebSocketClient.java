package com.ssafy.securities.stock.service.stockWebSocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.securities.stock.dto.StockBarDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
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
        log.info("WebSocket connected successfully");
    }

    public void subscribeStock(String stockCode, String approvalKey) {
        WebSocketSession session = sessionRef.get();
//        if (session != null && session.isOpen()) {
            try {
                String subscriptionMessage = createSubscriptionMessage(stockCode, approvalKey);
                session.sendMessage(new TextMessage(subscriptionMessage));
                log.info("Subscription request sent for stock: {} = {}", stockCode, subscriptionMessage);
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
//        log.info("Received message:{} - {}",message, message.getPayload());
        try {
            // 메시지 처리 로직 (종목 코드 추출 및 데이터 처리)
            StockBarDTO stockData = parseStockData(payload);
//            log.info(stockData.toString());
            String stockCode = extractStockCode(payload); // 이 메서드는 구현 필요
            dataProcessor.handleMessage(stockCode, stockData);
        } catch (Exception e) {
            log.info("Other: {}", message.getPayload());
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
    private StockBarDTO parseStockData(String payload) {
        // JSON 파싱 로직 구현
        String[] arrValue = payload.split("\\^");

        return StockBarDTO.builder()
                .stckBsopDate(arrValue[32])     // 영업일자
                .stckClpr(arrValue[2])          // 주식현재가 (종가)
                .stckOprc(arrValue[7])          // 주식시가
                .stckHgpr(arrValue[8])          // 주식최고가
                .stckLwpr(arrValue[9])          // 주식최저가
                .acmlVol(arrValue[13])          // 누적거래량
                .acmlTrPbmn(arrValue[14])       // 누적거래대금
                .flngClsCode(arrValue[33])      // 신장운영구분코드
                .prttRate(arrValue[22])         // 매수비율 (배당률로 가정)
                .modYn(arrValue[34])            // 거래정지여부 (수정 여부로 가정)
                .prdyVrssSign(arrValue[3])      // 전일대비부호
                .prdyVrss(arrValue[4])          // 전일대비
                .revlIssuReas("")               // 공시 사유 (해당 데이터 없음)
                .build();
    }

    private String extractStockCode(String payload) {
        // 페이로드에서 종목 코드를 추출하는 로직 구현
        // 예: JSON 파싱 후 해당 필드 추출
        String[] arrValue = payload.split("\\^");
//        log.info("payload: {}", Arrays.toString(arrValue));
        String[] keys = arrValue[0].split("\\|");
//        log.info("keys: {}", Arrays.toString(keys));
        return keys[3]; // 실제 구현 필요
    }

}