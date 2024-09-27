package com.ssafy.securities.gold.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.securities.gold.dto.response.GoldItemDto;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class GoldServiceImpl implements GoldService {

    private final RestTemplate restTemplate;
    @Value("${gold.APIKEY}")
    private String APIKEY;

    public GoldServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public GoldItemDto saveGold() throws IOException {
        LocalDate yesterday = LocalDate.now().minusDays(2);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String yesterdayDate = yesterday.format(formatter);

        StringBuilder urlBuilder = new StringBuilder(
            "https://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo");
        urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=" + APIKEY);
        urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=1");
        urlBuilder.append("&" + URLEncoder.encode("resultType", "UTF-8") + "=json");
        urlBuilder.append("&" + URLEncoder.encode("basDt", "UTF-8") + "=" + yesterdayDate);
        urlBuilder.append(
            "&" + URLEncoder.encode("likeItmsNm", "UTF-8") + "=" + URLEncoder.encode("금 99.99_1Kg",
                "UTF-8"));

        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");

        BufferedReader rd;
        if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        // 9. 저장된 데이터를 라인별로 읽어 StringBuilder 객체로 저장.
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        // 10. 객체 해제.
        rd.close();
        conn.disconnect();
        // 11. 전달받은 데이터 확인.
        System.out.println(sb.toString());

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(sb.toString());

        JsonNode itemNode = rootNode.path("response").path("body").path("items").path("item")
            .get(0);

        LocalDate today = LocalDate.now();
        formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String todayDate = today.format(formatter);

        GoldItemDto item = GoldItemDto
            .builder()
            .date(todayDate)
            .srtnCd(itemNode.path("srtnCd").asText())
            .isin(itemNode.path("isinCd").asText())
            .itemName(itemNode.path("itmsNm").asText())
            .close(itemNode.path("clpr").asText())
            .vsYesterday(itemNode.path("vs").asText())
            .upDownRate(itemNode.path("fltRt").asText())
            .open(itemNode.path("mkp").asText())
            .high(itemNode.path("hipr").asText())
            .low(itemNode.path("lopr").asText())
            .tradeAmount(itemNode.path("trqu").asText())
            .tradePrice(itemNode.path("trPrc").asText())
            .build();

        return item;

    }
}
