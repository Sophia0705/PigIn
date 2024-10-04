package com.ssafy.c203.domain.stock.service;

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
    public boolean buyStock(Long userId, String stockId, Long price) {
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
                SecuritiesStockTrade tradeResult = SecuritiesStockBuy(stockId, price);
                // 4. 거래 기록 저장
                saveTradeRecord(member, stockItem, tradeResult.getResult(), tradeResult.getTradePrice(), TradeMethod.BUY);
                // 5. 보유 주식 업데이트
                Optional<StockPortfolio> portfolio = stockPortfolioRepository.findByStockItemAndMember(stockItem, member);
                if (portfolio.isPresent()) {
                    updateStockPortfolio(portfolio.get(), tradeResult.getResult());
                } else {
                    StockPortfolio newPortfolio = StockPortfolio.builder()
                            .stockItem(stockItem)
                            .member(member)
                            .amount(tradeResult.getResult())
                            .build();
                    stockPortfolioRepository.save(newPortfolio);
                }
                return true;
            } else {
                // 6. 대기 큐에 저장
                saveToWaitingQueue(member, stockItem, price.doubleValue(), TradeMethod.BUY);
                return false;
            }
        } catch (Exception e) {
            // 7. 예외 발생 시 출금 취소
            deposit(userId, price);
            log.error("주식 매수 중 오류 발생: ", e);
            throw new RuntimeException("주식 매수 처리 중 오류가 발생했습니다.", e);
        }
    }


    @Override
    public boolean sellStock(Long userId, String stockId, Double count) {
        // 입력 검증
        StockItem stockItem = stockItemRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("주식을 찾을 수 없습니다: " + stockId));
        Members member = memberService.findMemberById(userId);
        StockPortfolio stockPortfolio = validateStockPortfolio(stockId, userId, count);

        // 1. 보유 주식 수량 감소
        updateStockPortfolio(stockPortfolio, -count);
        try {
            if (isBusinessHours()) {
                // 2. 주식 매도 처리
                SecuritiesStockTrade tradeResult = SecuritiesStockSell(stockId, count);
                // 3. 거래 기록 저장
                saveTradeRecord(member, stockItem, count, tradeResult.getTradePrice(), TradeMethod.SELL);
                // 4. 입금 처리
                long saleAmount = Math.round(tradeResult.getResult());
                if (!deposit(userId, saleAmount)) {
                    throw new RuntimeException("매도 금액 입금 실패");
                }
                return true;
            } else {
                // 6. 대기 큐에 저장
                saveToWaitingQueue(member, stockItem, count, TradeMethod.SELL);
                return false;
            }
        } catch (Exception e) {
            log.error("주식 매도 중 오류 발생: ", e);
            updateStockPortfolio(stockPortfolio, count);
            throw new RuntimeException("주식 매도 처리 중 오류가 발생했습니다.", e);
        }
    }

    // 해당 주식 판매 여부 검증
    private StockPortfolio validateStockPortfolio(String stockId, Long userId, Double count) {
        StockPortfolio stockPortfolio = stockPortfolioRepository.findByStockItem_IdAndMember_Id(stockId, userId)
                .orElseThrow(() -> new RuntimeException("해당 주식 포트폴리오를 찾을 수 없습니다."));
        if (stockPortfolio.getAmount() < count) {
            throw new RuntimeException("보유 주식 수량이 부족합니다.");
        }
        return stockPortfolio;
    }

    // Securities 에 판매 요청
    private SecuritiesStockTrade SecuritiesStockSell(String stockId, Double count) {
        String url = SECURITIES_URL + "/stock/trade/sell";
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("stockCode", stockId);
        requestBody.put("quantity", count);

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

    // 거래 기록 저장
    private void saveTradeRecord(Members member, StockItem stockItem, Double count, Double price, TradeMethod method) {
        StockTrade stockTrade = StockTrade.builder()
                .method(method)
                .count(count)
                .price(price)
                .tradeTime(LocalDateTime.now())
                .stockItem(stockItem)
                .member(member)
                .build();
        stockTradeRepository.save(stockTrade);
    }

    // 주식 보유량 수정
    private void updateStockPortfolio(StockPortfolio stockPortfolio, Double soldCount) {
        stockPortfolio.addAmount(soldCount);
        stockPortfolioRepository.save(stockPortfolio);
    }

    // 대기 큐 삽입
    private void saveToWaitingQueue(Members member, StockItem stockItem, Double count, TradeMethod method) {
        StockWaitingQueue stockWaitingQueue = StockWaitingQueue.builder()
                .tradeTime(LocalDateTime.now())
                .tradeAmount(count)
                .stockItem(stockItem)
                .method(method)
                .member(member)
                .build();
        stockWaitingQueueRepository.save(stockWaitingQueue);
    }

    // 출금
    public boolean withdraw(Long userId, Long price) {
        return accountService.withdrawAccount(userId, price);
    }

    // 입금
    public boolean deposit(Long userId, Long price) {
        return accountService.depositAccount(userId, price);
    }

    // 시간 검증
    public static boolean isBusinessHours() {
        LocalTime now = LocalTime.now();
        LocalTime start = LocalTime.of(9, 30);
        LocalTime end = LocalTime.of(15, 30);

        return !now.isBefore(start) && !now.isAfter(end);
    }

    // 주식 구매
    private SecuritiesStockTrade SecuritiesStockBuy(String stockId, Long price) {
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

    // 주식 리스트 저장
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
