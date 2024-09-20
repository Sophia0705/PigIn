package com.ssafy.securities.stock.service.stockWebSocket;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.securities.stock.dto.StockBarDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;

public class StockWebSocketClient extends TextWebSocketHandler {

    private WebSocketSession session;
    private final String stockCode;
    private final MultiStockDataProcessor dataProcessor;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Value("${koreainvestment.APPKEY}")
    private String appkey;
    @Value("${koreainvestment.APPSECRET}")
    private String appsecret;
    private String personalsecKey = "";
    private String custType = "P";
    private String contentType = "utf-8";

    public StockWebSocketClient(String stockCode, MultiStockDataProcessor dataProcessor) {
        this.stockCode = stockCode;
        this.dataProcessor = dataProcessor;
    }

    public void connect(String url) throws Exception {
        WebSocketClient client = new StandardWebSocketClient();
        session = client.doHandshake(this, url).get();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket 연결 성공: " + stockCode);
        sendSubscriptionRequest();
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        StockBarDTO stockData = parseStockData(message.getPayload());
        dataProcessor.handleMessage(stockCode, stockData);
    }

    private void sendSubscriptionRequest() {
        try {
            String subscriptionMessage = createSubscriptionMessage(stockCode);
            session.sendMessage(new TextMessage(subscriptionMessage));
            System.out.println("구독 요청 전송: " + stockCode);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String createSubscriptionMessage(String stockCode) throws JsonProcessingException {
        // 실제 구독 메시지 형식에 맞게 구현
        Map<String, Object> request = Map.of(
                "header", Map.of(
                        "personalseckey", "",
                        "appsecret", appsecret,
                        "tr_type", "1",
                        "appkey", appkey,
                        "content-type", contentType,
                        "custtype", custType
                ),
                "body", Map.of(
                        "input", Map.of(
                                "tr_id", "H0STCNT0",
                                "tr_key", stockCode
                        )
                )
        );
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

}