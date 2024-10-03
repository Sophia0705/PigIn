package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.common.dto.header.UserHeader;
import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.service.MemberService;
import com.ssafy.c203.domain.stock.dto.SecuritiesStockTrade;
import com.ssafy.c203.domain.stock.entity.StockItem;
import com.ssafy.c203.domain.stock.entity.StockTrade;
import com.ssafy.c203.domain.stock.entity.StockWaitingQueue;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
import com.ssafy.c203.domain.stock.repository.StockItemRepository;
import com.ssafy.c203.domain.stock.repository.StockTradeRepository;
import com.ssafy.c203.domain.stock.repository.StockWaitingQueueRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockDetailRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockHistoryRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockMinuteRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StockServiceImpl implements StockService {

    private final MongoStockDetailRepository mongoStockDetailRepository;
    private final MongoStockHistoryRepository mongoStockHistoryRepository;
    private final MongoStockMinuteRepository mongoStockMinuteRepository;
    private final StockItemRepository stockItemRepository;
    private final StockTradeRepository stockTradeRepository; ;
    private final StockWaitingQueueRepository sockWaitingQueueRepository;


    private final MemberService memberService;
    private final AccountService accountService;
    private final RestTemplate restTemplate;
    private final StockWaitingQueueRepository stockWaitingQueueRepository;
    private Map<String, String> intervals;

    @Value("${ssafy.securities.url}")
    private String SECURITIES_URL;


    @PostConstruct
    public void init() {
        intervals = new HashMap<>();
        intervals.put("day", "D");
        intervals.put("week", "W");
        intervals.put("month", "M");

        // 주식 코드 저장
        saveStockItems();
    }

    @Override
    public List<MongoStockDetail> findAllStock() {
        try {
            // 연결 테스트
//            mongoStockDetailRepository.count();
            return mongoStockDetailRepository.findAll();
        } catch (Exception e) {
            log.error("Error fetching all stocks: ", e);
            throw new RuntimeException("Failed to fetch stocks from database", e);
        }
    }

    @Override
    public List<MongoStockDetail> searchStock(String keyword) {
        return mongoStockDetailRepository.findByHtsKorIsnmLike(keyword);
    }

    @Override
    public MongoStockDetail findStock(String stockCode) {
        return mongoStockDetailRepository.findByStckShrnIscd(stockCode).orElseThrow();
    }

    @Override
    public List<MongoStockHistory> findStockChart(String stockCode, String interval, Integer count) {
        Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "date"));
        try {
            List<MongoStockHistory> tmp = mongoStockHistoryRepository.findByStockCodeAndIntervalOrderByDateDesc(stockCode, intervals.get(interval), pageable);
            return tmp;
        } catch (Exception e) {
            log.error("Error fetching stock chart: ", e);
            throw new RuntimeException("Failed to fetch stock chart", e);
        }
//        log.info("tmp = {}", tmp);
    }

    @Override
    public List<MongoStockMinute> findStockMinuteChart(String stockCode, Integer count) {
        Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "date"));
        List<MongoStockMinute> tmp = mongoStockMinuteRepository.findByStockCodeOrderByDateDescTimeDesc(stockCode, pageable);
        return tmp;
    }

    @Override
    public List<MongoStockMinute> findStockMinute() {
        return mongoStockMinuteRepository.findLatestStockMinuteForEachStock();
    }

    @Override
    public void buyStock(Long userId, Long stockId, Long price) {

        // StockId 검증
        StockItem stockItem = stockItemRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock item not found"));
        // 유저 검증
        Members members = memberService.findMemberById(userId);

        // 1. 잔고 확인
        if (checkWithdraw(userId, stockId)) {
            throw new RuntimeException();
        }
        // 2. 출금
        if (!withdraw(userId, stockId)) {
            throw new RuntimeException();
        }
        // 3. 시간 체크
        if (isBusinessHours()) {
            // 매수 로직
            String url = SECURITIES_URL + "/stock/trade/buy";

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("stockCode", stockId);
            requestBody.put("quantity", price);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            try {
                ResponseEntity<SecuritiesStockTrade> response = restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        entity,
                        SecuritiesStockTrade.class
                );

                // 거래 기록 저장
                StockTrade stockTrade = StockTrade.builder()
                        .method(TradeMethod.BUY)
                        .count(response.getBody().getResult())
                        .price(response.getBody().getTradePrice())
                        .tradeTime(LocalDateTime.now())
                        .stockItem(stockItem)
                        .member(members)
                        .build();

                stockTradeRepository.save(stockTrade);
            } catch (Exception e) {
                log.error("매수 통신, 저장 에러 = {}",e.getMessage());
            }
        } else {
            // 대기 큐 저장
            StockWaitingQueue stockWaitingQueue = StockWaitingQueue.builder()
                    .tradeTime(LocalDateTime.now())
                    .tradePrice(price)
                    .stockItem(stockItem)
                    .member(members)
                    .build();
            stockWaitingQueueRepository.save(stockWaitingQueue);
        }
    }

    public Boolean checkWithdraw(Long userId, Long price) {
        Long balance = accountService.findDAccountBalanceByMemberId(userId);

        if (balance < price) {
            return false;
        }
        return true;
    }

    public boolean withdraw(Long userId, Long price) {
        return accountService.withdrawAccount(userId, price);
    }

    public boolean deposit(Long userId, Long price) {
        return accountService.depositAccount(userId, price);
    }

    public static boolean isBusinessHours() {
        LocalTime now = LocalTime.now();
        LocalTime start = LocalTime.of(9, 30);
        LocalTime end = LocalTime.of(15, 30);

        return !now.isBefore(start) && !now.isAfter(end);
    }

    public void saveStockItems() {
        stockItemRepository.save(new StockItem("005930", "삼성전자"));
        stockItemRepository.save(new StockItem("086520", "에코프로"));
        stockItemRepository.save(new StockItem("000660", "SK하이닉스"));
        stockItemRepository.save(new StockItem("035420", "NAVER"));
        stockItemRepository.save(new StockItem("373220", "LG에너지솔루션"));
        stockItemRepository.save(new StockItem("352820", "하이브"));
        stockItemRepository.save(new StockItem("035720", "카카오"));
        stockItemRepository.save(new StockItem("005380", "현대차"));
        stockItemRepository.save(new StockItem("001040", "CJ"));
        stockItemRepository.save(new StockItem("105560", "KB금융"));
        stockItemRepository.save(new StockItem("000810", "삼성화재"));
        stockItemRepository.save(new StockItem("010130", "고려아연"));
        stockItemRepository.save(new StockItem("000100", "유한양행"));
        stockItemRepository.save(new StockItem("068270", "셀트리온"));
        stockItemRepository.save(new StockItem("006400", "삼성SDI"));
        stockItemRepository.save(new StockItem("051910", "LG화학"));
        stockItemRepository.save(new StockItem("000670", "영풍"));
        stockItemRepository.save(new StockItem("247540", "에코프로비엠"));
        stockItemRepository.save(new StockItem("096770", "SK이노베이션"));
        stockItemRepository.save(new StockItem("196170", "알테오젠"));
    }
}
