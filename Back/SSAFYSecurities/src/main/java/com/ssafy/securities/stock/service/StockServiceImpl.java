package com.ssafy.securities.stock.service;

import com.ssafy.securities.stock.dto.apiResponse.apiResponse.AccessTokenResponse;
import com.ssafy.securities.stock.dto.apiResponse.apiResponse.StockResponse;
import com.ssafy.securities.stock.dto.header.RequestHeader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

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

    private final RestTemplate restTemplate;

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

        log.info(response.getBody().toString());
    }

    @Override
    public void getMonthlyBar() {
        StockResponse response = getBar("M");
        log.info(response.toString());
    }

    @Override
    public void getWeeklyBar() {

    }

    @Override
    public void getDailyBar() {

    }

    private StockResponse getBar(String FID_PERIOD_DIV_CODE) {
        String url = "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice";

        DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        String dateTime = dateFormat.format(new Date());

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(prop)
                .path(url)
                .queryParam("fid_cond_mrkt_div_code", "J")
                .queryParam("fid_input_iscd", "005930") // 삼성 코드
                .queryParam("fid_input_date_1", "20230911")
                .queryParam("fid_input_date_2", dateTime)
                .queryParam("fid_period_div_code", FID_PERIOD_DIV_CODE)
                .queryParam("fid_org_adj_prc", "1");

        HttpHeaders headers = new HttpHeaders();
        headers.add("content-type", "application/json");
        headers.add("appKey", appKey);
        headers.add("appsecret", appSecret);
        headers.add("authorization", "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjhiNzQzOGYxLWU1ZTYtNGJhMi1hOTgwLWIyZTBhOTg3MzNmOSIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTcyNjE4NzI5MSwiaWF0IjoxNzI2MTAwODkxLCJqdGkiOiJQU1pDUGl0WHcyQmlXT01RZXF6N1JMQkhaZ3YzZ3Y5bmdtMXAifQ.TWGEg9keZYkM-5QZLa7hC7pA4oZBB5JOXqrutGChVcTi3aDfDQ1o6_LXjv2fb8xR2vAN8e5Sho5gEFs0M9mtwA");
        headers.add("tr_id", "FHKST03010100");
        HttpEntity<Object> request = new HttpEntity(headers);

        log.info(request.toString());
        log.info("uri: {}", builder.toUriString());


        try {
            HttpEntity<StockResponse> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    request,
                    StockResponse.class
            );
            log.info(response.getBody().toString());
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
