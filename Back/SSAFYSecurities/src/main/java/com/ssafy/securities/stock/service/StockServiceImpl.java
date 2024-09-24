package com.ssafy.securities.stock.service;

import com.ssafy.securities.stock.dto.AccessTokenDTO;
import com.ssafy.securities.stock.dto.apiResponse.apiResponse.AccessTokenResponse;
import com.ssafy.securities.stock.dto.apiResponse.apiResponse.StockDataDTO;
import com.ssafy.securities.stock.dto.apiResponse.apiResponse.StockResponse;
import com.ssafy.securities.stock.entity.StockHistory;
import com.ssafy.securities.stock.repository.StockHistoryRepository;
import com.ssafy.securities.stock.repository.StockMinuteRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockServiceImpl implements StockService{

    @Value("${koreainvestment.PROD}")
    private String prop;
    @Value("${koreainvestment.APPKEY}")
    private String appKey;
    @Value("${koreainvestment.APPSECRET}")
    private String appSecret;
    @Value("#{'${stock.codes}'.split(',')}")
    private List<String> stockCodes;

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private String accessToken;

    private final RestTemplate restTemplate;
    private final StockHistoryRepository stockHistoryRepository;
    private final StockMinuteRepository stockMinuteRepository;

    @PostConstruct
    public void init() {
        // MongoDB 싹다 지우기 일봉, 주봉, 월봉 데이터를 MongoDB에 저장
        stockHistoryRepository.deleteAll();
        stockMinuteRepository.deleteAll();
        scheduler.scheduleAtFixedRate(this::getToken, 0, 23, TimeUnit.HOURS);
        scheduler.scheduleAtFixedRate(this::getMonthlyBar, 0, 24 * 28, TimeUnit.HOURS);
        scheduler.scheduleAtFixedRate(this::getWeeklyBar, 0, 24 * 7, TimeUnit.HOURS);
        scheduler.scheduleAtFixedRate(this::getDailyBar, 0, 24, TimeUnit.HOURS);
    }

    @Override
    public void getAccessToken() {
        String url = prop + "/oauth2/tokenP";
        HttpHeaders headers = new HttpHeaders();
        headers.add("content-type", "application/json");
        HashMap<String, String> body = new HashMap<>();
        body.put("grant_type", "client_credentials");
        body.put("appkey", appKey);
        body.put("appsecret", appSecret);

        HttpEntity<HashMap> request = new HttpEntity<>(body, headers);

        ResponseEntity<AccessTokenResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                AccessTokenResponse.class
        );

//        log.info(response.getBody().toString());
    }

    @Override
    public void getMonthlyBar() {
        stockCodes.forEach(stockCode -> {
            StockResponse response = getBar("M", stockCode);
//            log.info("Stock[{}] = {}", stockCode, response.toString());
        });
    }

    @Override
    public void getWeeklyBar() {
        stockCodes.forEach(stockCode -> {
            StockResponse response = getBar("W", stockCode);
//            log.info("Stock[{}] = {}", stockCode, response.toString());
        });
    }

    @Override
    public void getDailyBar() {
        stockCodes.forEach(stockCode -> {
            StockResponse response = getBar("D", stockCode);
//            log.info("Stock[{}] = {}", stockCode, response.toString());
        });
    }

    @Transactional
    public StockResponse getBar(String FID_PERIOD_DIV_CODE, String code) {
        String url = "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice";

        DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        String dateTime = dateFormat.format(new Date());

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(prop)
                .path(url)
                .queryParam("fid_cond_mrkt_div_code", "J")
                .queryParam("fid_input_iscd", code) // 삼성 코드
                .queryParam("fid_input_date_1", "20230911")
                .queryParam("fid_input_date_2", dateTime)
                .queryParam("fid_period_div_code", FID_PERIOD_DIV_CODE)
                .queryParam("fid_org_adj_prc", "1");

        HttpHeaders headers = new HttpHeaders();
        headers.add("content-type", "application/json");
        headers.add("appKey", appKey);
        headers.add("appsecret", appSecret);
        headers.add("authorization", "Bearer " + accessToken);
        headers.add("tr_id", "FHKST03010100");
        HttpEntity<Object> request = new HttpEntity(headers);

//        log.info(request.toString());
//        log.info("uri: {}", builder.toUriString());


        try {
            HttpEntity<StockResponse> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    request,
                    StockResponse.class
            );


            String stockCode = response.getBody().getStockDetails().getStckShrnIscd();

            List<StockHistory> stockHistoryList = response.getBody().getStockData().stream()
                    .map(dto -> new StockHistory(dto, stockCode, FID_PERIOD_DIV_CODE))
                    .collect(Collectors.toList());

            stockHistoryRepository.insert(stockHistoryList);

            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private void getToken() {
        String url = prop + "/oauth2/tokenP";

        HttpHeaders headers = new HttpHeaders();
        headers.add("content-type", "application/json");

        Map<String, String> body = new HashMap<>();
        body.put("grant_type", "client_credentials");
        body.put("appkey", appKey);
        body.put("appsecret", appSecret);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
//        log.info(request.toString());

        try {
            HttpEntity<AccessTokenDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    AccessTokenDTO.class
            );
//            log.info(response.getBody().toString());
            accessToken = response.getBody().getAccessToken();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
