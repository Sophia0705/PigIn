package com.ssafy.securities.coin.service;

import com.ssafy.securities.coin.dto.CoinRestDTO;
import com.ssafy.securities.coin.dto.CoinTradeResponse;
import com.ssafy.securities.coin.entity.CoinHistory;
import com.ssafy.securities.coin.entity.CoinMinute;
import com.ssafy.securities.coin.repository.CoinHistoryRepository;
import com.ssafy.securities.coin.repository.CoinMinuteRepository;
import com.ssafy.securities.stock.entity.StockHistory;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CoinService {

    @Value("${upbit.PROD}")
    private String prod;
    @Value("#{'${upbit.codes}'.split(',')}")
    private List<String> codes;
    private final RestTemplate restTemplate;

    private final CoinHistoryRepository coinHistoryRepository;
    private final CoinMinuteRepository coinMinuteRepository;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    @PostConstruct
    public void init() throws InterruptedException {
        coinHistoryRepository.deleteAll();
        coinMinuteRepository.deleteAll();
        scheduler.scheduleAtFixedRate(this::startMonthData, 0, 24 * 28, TimeUnit.HOURS);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        scheduler.scheduleAtFixedRate(this::startWeekData, 0, 24 * 7, TimeUnit.HOURS);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        scheduler.scheduleAtFixedRate(this::startDayData, 0, 23, TimeUnit.HOURS);
    }

    // 월봉
    private void startMonthData() {
        for (String code : codes) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            getBar(code, "months", "100");
        }
    }

    // 주봉
    private void startWeekData() {
        for (String code : codes) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            getBar(code, "weeks", "100");
        }
    }

    // 일봉
    private void startDayData() {
        for (String code : codes) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            getBar(code, "days", "100");
        }
    }

    public List<CoinRestDTO> getBar(String market, String candle, String count) {

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(prod)
                .path("/candles/" + candle)
                .queryParam("market", market)
                .queryParam("count", count);

        HttpHeaders headers = new HttpHeaders();
        headers.add("accept", "application/json");
        HttpEntity<Object> request = new HttpEntity(headers);

        try {
            HttpEntity<List<CoinRestDTO>> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    request,
                    new ParameterizedTypeReference<>() {}
            );

            List<CoinHistory> coinHistories = response.getBody().stream()
                    .map(dto -> new CoinHistory(dto, candle))
                    .toList();
            coinHistoryRepository.insert(coinHistories);
            return response.getBody();
        } catch (Exception e) {
            log.info("market:{}", market, e);
            e.printStackTrace();
        }
        return null;
    }

    public CoinTradeResponse buyCoin(String coinCode, Double price) {
        // 1. Coin 가격 조회
        CoinMinute coinMinute = coinMinuteRepository.findFirstByCoinOrderByDateDescTimeDesc(coinCode)
                .orElseThrow();
        // 2. 판매시 가격 계산
        double quantity = price / coinMinute.getClose();

        // 반환
        return new CoinTradeResponse(quantity, coinMinute.getClose());
    }

    public CoinTradeResponse sellCoin(String coinCode, Double amount) {
        log.info("coinCode:{}, amount:{}", coinCode, amount);
        // 1. Coin 가격 조회
        CoinMinute coinMinute = coinMinuteRepository.findFirstByCoinOrderByDateDescTimeDesc(coinCode)
                .orElseThrow();
        // 2. 판매 시 수량 계산
        double quantity = amount * coinMinute.getClose();
        // 3. 반환
        return new CoinTradeResponse(quantity, coinMinute.getClose());
    }
}
