package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.common.dto.header.UserHeader;
import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.service.MemberService;
import com.ssafy.c203.domain.stock.dto.SecuritiesStockTrade;
import com.ssafy.c203.domain.stock.entity.StockItem;
import com.ssafy.c203.domain.stock.entity.StockPortfolio;
import com.ssafy.c203.domain.stock.entity.StockTrade;
import com.ssafy.c203.domain.stock.entity.StockWaitingQueue;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
import com.ssafy.c203.domain.stock.repository.StockItemRepository;
import com.ssafy.c203.domain.stock.repository.StockPortfolioRepository;
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
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private final StockPortfolioRepository stockPortfolioRepository;


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
    public void buyStock(Long userId, String stockId, Long price) {
        // 1. 입력 검증
        StockItem stockItem = stockItemRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock item not found: " + stockId));
        Members member = memberService.findMemberById(userId);

        // 2. 잔고 확인 및 출금
        if (!withdraw(userId, price)) {
            throw new RuntimeException("잔액 부족");
        }

        try {
            if (isBusinessHours()) {
                // 3. 주식 매수 처리
                SecuritiesStockTrade tradeResult = executeStockPurchase(stockId, price);
                // 4. 거래 기록 저장
                saveTradeRecord(member, stockItem, tradeResult);
                // 5. 보유 주식 업데이트
                updateStockPortfolio(member, stockItem, tradeResult.getResult());
            } else {
                // 6. 대기 큐에 저장
                saveToWaitingQueue(member, stockItem, price);
            }
        } catch (Exception e) {
            // 7. 예외 발생 시 출금 취소
            deposit(userId, price);
            log.error("주식 매수 중 오류 발생: ", e);
            throw new RuntimeException("주식 매수 처리 중 오류가 발생했습니다.", e);
        }
    }


    @Override
    public void sellStock(Long userId, String stockId, Double count) {
        // StockId 검증
        StockItem stockItem = stockItemRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock item not found"));
        // 유저 검증
        Members members = memberService.findMemberById(userId);

        // 1. 보유 주식 개수 확인
        StockPortfolio stockPortfolio = stockPortfolioRepository.findByStockItem_IdAndMember_Id(stockId, userId)
                .orElseThrow(() -> new RuntimeException("Stock portfolio not found"));
        if (stockPortfolio.getAmount() < count) {
            throw new RuntimeException("보유량 적음");
        }

        // 2. 시간 확인
        if (isBusinessHours()) {
            // 3 - 1 거래 시간시 매도 요청 + 입금, 주식 수 빼기
            String url = SECURITIES_URL + "/stock/trade/sell";

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("stockCode", stockId);
            requestBody.put("quantity", count);

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
                        .method(TradeMethod.SELL)
                        .count(count)
                        .price(response.getBody().getTradePrice())
                        .tradeTime(LocalDateTime.now())
                        .stockItem(stockItem)
                        .member(members)
                        .build();
                stockTradeRepository.save(stockTrade);

                // 입금
                if (!deposit(userId, Math.round(response.getBody().getResult()))) {
                    throw new RuntimeException("입금 실패");
                }
                // 주식 빼기
                // TODO: 보유 주식 빼기 로직 필요

            } catch (Exception e) {
                // TODO: 예외 발생 시 코인 개수 다시 저장 로직 필요
                log.error("매도 통신, 저장 에러 = {}",e.getMessage());
            }
        }
        else {
            // 3 - 2 거래 시간 아닐 시 대기큐 삽입
            StockWaitingQueue stockWaitingQueue = StockWaitingQueue.builder()
                    .tradeTime(LocalDateTime.now())
                    .tradeAmount(count)
                    .stockItem(stockItem)
                    .method(TradeMethod.SELL)
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

    private SecuritiesStockTrade executeStockPurchase(String stockId, Long price) {
        String url = SECURITIES_URL + "/stock/trade/buy";
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("stockCode", stockId);
        requestBody.put("quantity", price);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<SecuritiesStockTrade> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                SecuritiesStockTrade.class
        );

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new RuntimeException("증권사 API 호출 실패");
        }

        return response.getBody();
    }

    private void saveTradeRecord(Members member, StockItem stockItem, SecuritiesStockTrade tradeResult) {
        StockTrade stockTrade = StockTrade.builder()
                .method(TradeMethod.BUY)
                .count(tradeResult.getResult())
                .price(tradeResult.getTradePrice())
                .tradeTime(LocalDateTime.now())
                .stockItem(stockItem)
                .member(member)
                .build();
        stockTradeRepository.save(stockTrade);
    }

    private void updateStockPortfolio(Members member, StockItem stockItem, Double purchasedAmount) {
        stockPortfolioRepository.findByStockItemAndMember(stockItem, member)
                .ifPresentOrElse(
                        portfolio -> {
                            portfolio.addAmount(purchasedAmount);
                            stockPortfolioRepository.save(portfolio);
                        },
                        () -> {
                            StockPortfolio newPortfolio = StockPortfolio.builder()
                                    .stockItem(stockItem)
                                    .member(member)
                                    .amount(purchasedAmount)
                                    .build();
                            stockPortfolioRepository.save(newPortfolio);
                        }
                );
    }

    private void saveToWaitingQueue(Members member, StockItem stockItem, Long price) {
        StockWaitingQueue stockWaitingQueue = StockWaitingQueue.builder()
                .tradeTime(LocalDateTime.now())
                .tradePrice(price)
                .stockItem(stockItem)
                .method(TradeMethod.BUY)
                .member(member)
                .build();
        stockWaitingQueueRepository.save(stockWaitingQueue);
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
