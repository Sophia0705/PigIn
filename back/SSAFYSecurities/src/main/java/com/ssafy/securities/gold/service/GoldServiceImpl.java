package com.ssafy.securities.gold.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.securities.gold.dto.response.GoldItemDto;
import com.ssafy.securities.gold.dto.response.GoldParsingDto;
import com.ssafy.securities.gold.dto.response.GoldYearDto;
import com.ssafy.securities.gold.entity.Gold;
import com.ssafy.securities.gold.repository.GoldRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoldServiceImpl implements GoldService {

    @Value("${gold.APIKEY}")
    private String APIKEY;
    private final GoldRepository goldRepository;

    @Override
    public GoldItemDto getGold() throws IOException {
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

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(sb.toString());

        JsonNode itemNode = rootNode.path("response").path("body").path("items").path("item")
            .get(0);

        LocalDate today = LocalDate.now();

        GoldItemDto item = GoldItemDto
            .builder()
            .date(today)
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

    @Override
    public void saveGold(GoldItemDto gold) {
        goldRepository.save(Gold
            .builder()
            .close(gold.getClose())
            .date(gold.getDate())
            .high(gold.getHigh())
            .isin(gold.getIsin())
            .itemName(gold.getItemName())
            .low(gold.getLow())
            .open(gold.getOpen())
            .srtnCd(gold.getSrtnCd())
            .tradeAmount(gold.getTradeAmount())
            .tradePrice(gold.getTradePrice())
            .upDownRate(gold.getUpDownRate())
            .vsYesterday(gold.getVsYesterday())
            .build());
    }

    @Override
    public void saveAllGold()
        throws IOException {
        goldRepository.deleteAll();

        //날짜 생성
        GetDateRange getDateRange = new GetDateRange();

        LocalDate startDate = LocalDate.of(2020, 1, 1);
        LocalDate endDate = LocalDate.of(2022, 4, 30);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        List<String> dateList = getDateRange.generateMonthlyStartEndDates(startDate, endDate);

        for (int i = 0; i < dateList.size(); i += 2) {
            StringBuilder urlBuilder = new StringBuilder(
                "https://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo");
            urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=" + APIKEY);
            urlBuilder.append(
                "&numOfRows=100&resultType=json&beginBasDt=");
            urlBuilder.append(dateList.get(i));
            urlBuilder.append("&endBasDt=");
            urlBuilder.append(dateList.get(i + 1));
            urlBuilder.append("&itmsNm=%EA%B8%88%2099.99K");

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
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(sb.toString());
            JsonNode itemNode = rootNode.path("response").path("body").path("items").path("item");

            if (itemNode.isArray()) {
                for (JsonNode jsonNode : itemNode) {
                    GoldParsingDto item = objectMapper.treeToValue(jsonNode, GoldParsingDto.class);
                    goldRepository.save(Gold
                        .builder()
                        .close(item.getClpr())
                        .date(LocalDate.parse(item.getBasDt(), formatter))
                        .high(item.getHipr())
                        .low(item.getLopr())
                        .vsYesterday(item.getVs())
                        .isin(item.getIsinCd())
                        .itemName(item.getItmsNm())
                        .tradePrice(item.getTrPrc())
                        .tradeAmount(item.getTrqu())
                        .upDownRate(item.getFltRt())
                        .srtnCd(item.getSrtnCd())
                        .open(item.getMkp())
                        .build());
                }
            }
        }
        startDate = LocalDate.of(2022, 5, 1);
        endDate = LocalDate.now();

        dateList = getDateRange.generateMonthlyStartEndDates(startDate, endDate);

        for (int i = 0; i < dateList.size(); i += 2) {
            StringBuilder urlBuilder = new StringBuilder(
                "https://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo");
            urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=" + APIKEY);
            urlBuilder.append(
                "&numOfRows=100&resultType=json&beginBasDt=");
            urlBuilder.append(dateList.get(i));
            urlBuilder.append("&endBasDt=");
            urlBuilder.append(i + 1 < dateList.size() ? dateList.get(i + 1) : dateList.get(i));
            urlBuilder.append("&itmsNm=%EA%B8%88%2099.99_1Kg");

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

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(sb.toString());
            JsonNode itemNode = rootNode.path("response").path("body").path("items").path("item");

            if (itemNode.isArray()) {
                for (JsonNode jsonNode : itemNode) {
                    GoldParsingDto item = objectMapper.treeToValue(jsonNode, GoldParsingDto.class);
                    goldRepository.save(Gold
                        .builder()
                        .close(item.getClpr())
                        .date(LocalDate.parse(item.getBasDt(), formatter))
                        .high(item.getHipr())
                        .low(item.getLopr())
                        .vsYesterday(item.getVs())
                        .isin(item.getIsinCd())
                        .itemName(item.getItmsNm())
                        .tradePrice(item.getTrPrc())
                        .tradeAmount(item.getTrqu())
                        .upDownRate(item.getFltRt())
                        .srtnCd(item.getSrtnCd())
                        .open(item.getMkp())
                        .build());
                }
            }
        }
    }

    @Override
    public int getGoldPrice() {
        LocalDate today = LocalDate.now();
        String date = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Gold gold = goldRepository.findByDate(date);

        return Integer.parseInt(gold.getClose());
    }

    @Override
    public List<GoldYearDto> getGoldList() {
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);

        List<Gold> goldList = goldRepository.findByDateGreaterThanEqualOrderByDateDesc(oneYearAgo);

        return goldList.stream()
            .map(gold -> new GoldYearDto(gold.getDate(), gold.getClose()))
            .collect(Collectors.toList());
    }

    @Override
    public List<GoldYearDto> getGoldDaysList() {
        LocalDate oneWeeksAgo = LocalDate.now().minusWeeks(1);

        List<Gold> goldList = goldRepository.findAllByOrderByDateDesc(PageRequest.of(0, 7));

        return goldList.stream()
            .map(gold -> new GoldYearDto(gold.getDate(), gold.getClose()))
            .collect(Collectors.toList());
    }

    @Override
    public List<GoldYearDto> getGoldMonthsList() {
        LocalDate oneWeeksAgo = LocalDate.now().minusMonths(1);

        List<Gold> goldList = goldRepository.findAllByOrderByDateDesc(PageRequest.of(0, 30));

        return goldList.stream()
            .map(gold -> new GoldYearDto(gold.getDate(), gold.getClose()))
            .collect(Collectors.toList());
    }
}
