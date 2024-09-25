package com.ssafy.securities.coin.service;

import com.ssafy.securities.coin.dto.CoinRestDTO;
import com.ssafy.securities.coin.entity.CoinHistory;
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
    public void init() {
        coinHistoryRepository.deleteAll();
        coinMinuteRepository.deleteAll();
        scheduler.scheduleAtFixedRate(this::startMonthData, 0, 24 * 28, TimeUnit.HOURS);
        scheduler.scheduleAtFixedRate(this::startWeekData, 0, 24 * 7, TimeUnit.HOURS);
        scheduler.scheduleAtFixedRate(this::startDayData, 0, 23, TimeUnit.HOURS);
    }

    // 월봉
    private void startMonthData() {
        for (String code : codes) {
            getBar(code, "months", "100");
        }
    }

    // 주봉
    private void startWeekData() {
        for (String code : codes) {
            getBar(code, "weeks", "100");
        }
    }

    // 일봉
    private void startDayData() {
        for (String code : codes) {
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

        log.info(request.toString());
        log.info("uri: {}", builder.toUriString());


        try {
            HttpEntity<List<CoinRestDTO>> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    request,
                    new ParameterizedTypeReference<>() {}
            );
            log.info(response.getBody().toString());

            List<CoinHistory> coinHistories = response.getBody().stream()
                    .map(dto -> new CoinHistory(dto, candle))
                    .toList();
            coinHistoryRepository.insert(coinHistories);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
