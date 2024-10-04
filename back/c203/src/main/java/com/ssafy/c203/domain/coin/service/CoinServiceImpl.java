package com.ssafy.c203.domain.coin.service;

import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.coin.dto.FindCoinAllResponse;
import com.ssafy.c203.domain.coin.dto.SecuritiesCoinTrade;
import com.ssafy.c203.domain.coin.dto.FindCoinResponse;
import com.ssafy.c203.domain.coin.entity.CoinItem;
import com.ssafy.c203.domain.coin.entity.CoinPortfolio;
import com.ssafy.c203.domain.coin.entity.CoinTrade;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import com.ssafy.c203.domain.coin.repository.CoinItemRepository;
import com.ssafy.c203.domain.coin.repository.CoinPortfolioRepository;
import com.ssafy.c203.domain.coin.repository.CoinTradeRepository;
import com.ssafy.c203.domain.coin.repository.mongo.MongoCoinHistoryRepository;
import com.ssafy.c203.domain.coin.repository.mongo.MongoCoinMinuteRepository;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.service.MemberService;
import com.ssafy.c203.domain.stock.dto.SecuritiesStockTrade;
import com.ssafy.c203.domain.stock.entity.StockPortfolio;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
@Transactional
@RequiredArgsConstructor
public class CoinServiceImpl implements CoinService {

    private static final Logger log = LoggerFactory.getLogger(CoinServiceImpl.class);
    private final MongoCoinHistoryRepository mongoCoinHistoryRepository;
    private final MongoCoinMinuteRepository mongoCoinMinuteRepository;
    private final CoinItemRepository coinItemRepository;
    private final CoinTradeRepository coinTradeRepository;
    private final CoinPortfolioRepository coinPortfolioRepository;

    private final MemberService memberService;
    private final AccountService accountService;

    @Value("${ssafy.securities.url}")
    private String SECURITIES_URL;
    private final RestTemplate restTemplate;

    //쿼리문으로 넣기 귀찮아서 그냥 여기 작정했어요..ㅋ
    @PostConstruct
    private void init() {
        initializeCoinItems();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FindCoinAllResponse> findAllCoins() {
        List<CoinItem> coinItems = coinItemRepository.findAll();
        HashMap<String, String> coinItemMap = new HashMap<>();
        for (CoinItem coinItem : coinItems) {
            coinItemMap.put(coinItem.getId(), coinItem.getName());
        }

        List<FindCoinAllResponse> responses = mongoCoinMinuteRepository.findLatestDataForEachCoin().stream()
                .map(mongoCoin -> new FindCoinAllResponse(mongoCoin, coinItemMap))
                .toList();
        log.info(responses.toString());
        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FindCoinAllResponse> searchCoins(String keyword) {
        List<CoinItem> coinItems = coinItemRepository.findAll();
        HashMap<String, String> coinItemMap = new HashMap<>();
        for (CoinItem coinItem : coinItems) {
            coinItemMap.put(coinItem.getId(), coinItem.getName());
        }

        // 정규표현식 패턴 생성 (대소문자 구분 없이)
        Pattern pattern = Pattern.compile(keyword, Pattern.CASE_INSENSITIVE);

        List<FindCoinAllResponse> responses = mongoCoinMinuteRepository.findLatestDataForEachCoin().stream()
                .filter(mongoCoin -> {
                    String coinName = coinItemMap.get(mongoCoin.getCoin());
                    return coinName != null && pattern.matcher(coinName).find();
                })
                .map(mongoCoin -> new FindCoinAllResponse(mongoCoin, coinItemMap))
                .toList();

        log.info("Search results for '{}': {}", keyword, responses);

        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public FindCoinResponse findCoin(String coinCode) {
        MongoCoinMinute mongoCoinMinute = mongoCoinMinuteRepository.findTopByCoinOrderByDateDescTimeDesc(coinCode)
                .orElseThrow(); // 코인 데이터를 가져옴

        // 코인 이름 가져오기
        CoinItem coinItem = coinItemRepository.findById(coinCode).orElseThrow();
        String coinName = coinItem.getName();

        return new FindCoinResponse(mongoCoinMinute, coinName); // 코인 이름과 함께 반환
    }

    @Override
    @Transactional(readOnly = true)
    public List<MongoCoinHistory> findCoinChart(String coinCode, String interval, Integer count) {
        Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "date"));
        try {
            return mongoCoinHistoryRepository.findByCoinAndIntervalOrderByDateDesc(coinCode, interval, pageable);
        } catch (Exception e) {
            log.error("Error fetching coin chart: ", e);
            throw new RuntimeException("Failed to fetch coin chart", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<MongoCoinMinute> findCoinMinuteChart(String coinCode, Integer count) {
        Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "date", "time"));
        try {
            return mongoCoinMinuteRepository.findByCoinOrderByDateDescTimeDesc(coinCode, pageable);
        } catch (Exception e) {
            log.error("Error fetching coin minute chart: ", e);
            throw new RuntimeException("Failed to fetch coin minute chart", e);
        }
    }

    @Override
    public List<MongoCoinMinute> findCoinMinute() {
        try {
            return mongoCoinMinuteRepository.findLatestDataForEachCoin();
        } catch (Exception e) {
            log.error("Error fetching coin minute: ", e);
            throw new RuntimeException("Failed to fetch coin minute", e);
        }
    }

    @Override
    public void buyCoin(Long userId, String coinCode, Long price) {
        // 1. 입력 확인
        CoinItem coinItem = coinItemRepository.findById(coinCode)
                .orElseThrow(() -> new RuntimeException("No such coin"));
        Members member = memberService.findMemberById(userId);

        // 2. 잔고 확인 및 출금
        if (!withdraw(userId, price)) {
            throw new RuntimeException("잔액 부족");
        }
        try {
            // 3. 거래
            SecuritiesCoinTrade tradeResult = SecuritiesCoinBuy(coinCode, price);
            // 4. 거래내역 저장
            saveTradeRecode(member, coinItem, tradeResult.getResult(), tradeResult.getTradePrice(), TradeMethod.BUY);
            // 5. 보유 주식 업데이트
            Optional<CoinPortfolio> coinPortfolio = coinPortfolioRepository.findByCoinItemAndMember(coinItem, member);
            if (coinPortfolio.isPresent()) {
                updateCoinPortfolio(coinPortfolio.get(), tradeResult.getResult());
            } else {
                CoinPortfolio newPortfolio = CoinPortfolio.builder()
                        .coinItem(coinItem)
                        .member(member)
                        .amount(tradeResult.getResult())
                        .build();
                coinPortfolioRepository.save(newPortfolio);
            }
        } catch (Exception e) {
            deposit(userId, price);
            log.error("Error fetching coin: ", e);
        }
    }

    @Override
    public void sellCoin(Long userId, String coinCode, Double amount) {
        // 1. 입력 확인
        CoinItem coinItem = coinItemRepository.findById(coinCode)
                .orElseThrow(() -> new RuntimeException("No such coin"));
        Members member = memberService.findMemberById(userId);
        CoinPortfolio coinPortfolio = valiateCoinPortfolio(coinItem, member, amount);

        // 2. 코인 보유량 감소
        updateCoinPortfolio(coinPortfolio, -amount);
        try {
            // 3. 거래
            SecuritiesCoinTrade securitiesCoinTrade = SecuritiesCoinSell(coinCode, amount);
            log.info("거래 끝");
            // 4. 저장
            saveTradeRecode(member, coinItem, amount, securitiesCoinTrade.getResult(), TradeMethod.SELL);
            log.info("저장 끝");
            // 5. 입금
            long salePrice = Math.round(securitiesCoinTrade.getResult());
            log.info("거래내역:{}", securitiesCoinTrade);

            log.info("입금 끝");
            if (!deposit(userId, salePrice)) {
                throw new RuntimeException("입금 실패");
            }
        } catch (Exception e) {
            log.error("Error fetching coin: ", e);
            updateCoinPortfolio(coinPortfolio, amount);
            throw new RuntimeException("코인 매도 오류");
        }
    }

    public void initializeCoinItems() {
        List<CoinItem> coinItems = Arrays.asList(
                new CoinItem("KRW-BTC", "비트코인"),
                new CoinItem("KRW-ETH", "이더리움"),
                new CoinItem("KRW-USDT", "테더"),
                new CoinItem("KRW-XLM", "스텔라루멘"),
                new CoinItem("KRW-XRP", "리플"),
                new CoinItem("BTC-ETC", "이더리움클래식"),
                new CoinItem("BTC-BCH", "비트코인캐시"),
                new CoinItem("KRW-LINK", "체인링크"),
                new CoinItem("KRW-ADA", "에이다"),
                new CoinItem("KRW-DOGE", "도지코인")
        );
        coinItemRepository.saveAll(coinItems);
    }

    // 출금
    public boolean withdraw(Long userId, Long price) {
        return accountService.withdrawAccount(userId, price);
    }

    // 입금
    public boolean deposit(Long userId, Long price) {
        return accountService.depositAccount(userId, price);
    }

    // 코인 판매
    private SecuritiesCoinTrade SecuritiesCoinSell(String coinCode, Double count) {
        String url = SECURITIES_URL + "/coin/trade/sell";
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("coinCode", coinCode);
        requestBody.put("quantity", count);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        log.info(entity.toString());

        ResponseEntity<SecuritiesCoinTrade> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                SecuritiesCoinTrade.class
        );

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new RuntimeException("증권사 API 호출 실패");
        }
        return response.getBody();
    }

    // 코인 구매
    private SecuritiesCoinTrade SecuritiesCoinBuy(String coinCode, Long price) {
        String url = SECURITIES_URL + "/coin/trade/buy";
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("coinCode", coinCode);
        requestBody.put("quantity", price);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<SecuritiesCoinTrade> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                SecuritiesCoinTrade.class
        );

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new RuntimeException("증권사 API 호출 실패");
        }

        return response.getBody();
    }

    private void saveTradeRecode(Members members, CoinItem coinItem, Double amount, Double price, TradeMethod method) {
        CoinTrade coinTrade = CoinTrade.builder()
                .method(method)
                .count(amount)
                .price(price)
                .tradeTime(LocalDateTime.now())
                .coinItem(coinItem)
                .member(members)
                .build();
        coinTradeRepository.save(coinTrade);
    }

    private void updateCoinPortfolio(CoinPortfolio coinPortfolio, Double amount) {
        coinPortfolio.addAmount(amount);
        coinPortfolioRepository.save(coinPortfolio);
    }

    private CoinPortfolio valiateCoinPortfolio(CoinItem coinItem, Members members, Double amount) {
        CoinPortfolio coinPortfolio = coinPortfolioRepository.findByCoinItemAndMember(coinItem, members)
                .orElseThrow(() -> new RuntimeException("No such coin item"));
        if (amount > coinPortfolio.getAmount()) {
            throw new RuntimeException("보유 코인 수량 부족");
        }
        return coinPortfolio;
    }
}
