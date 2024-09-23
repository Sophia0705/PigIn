package com.ssafy.securities.coin.service;

import com.ssafy.securities.coin.dto.CoinRestDTO;
import com.ssafy.securities.coin.dto.CoinWebSocketBarDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CoinService {

    @Value("${upbit.PROD}")
    private String prod;
    @Value("#{'${upbit.codes}'.split(',')}")
    private List<String> codes;
    private final RestTemplate restTemplate;

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
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
