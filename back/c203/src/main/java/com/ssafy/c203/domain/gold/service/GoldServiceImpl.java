package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;
import com.ssafy.c203.domain.gold.dto.response.GoldYearDto;
import com.ssafy.c203.domain.gold.entity.GoldTrade;
import com.ssafy.c203.domain.gold.entity.GoldWaitingQueue;
import com.ssafy.c203.domain.gold.repository.GoldTradeRepository;
import com.ssafy.c203.domain.gold.repository.GoldWaitingQueueRepository;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GoldServiceImpl implements GoldService {

    private final GoldTradeRepository goldTradeRepository;
    private final GoldWaitingQueueRepository goldWaitingQueueRepository;
    private final MembersRepository membersRepository;
    private final RestTemplate restTemplate;

    private final LocalTime GOLD_END_TIME = LocalTime.of(15, 30);
    private final LocalTime GOLD_START_TIME = LocalTime.of(9, 30);

    @Value("${ssafy.securities.url}")
    private String MY_SECURITES_BASE_URL;


    @Override
    public void goldTradeRequest(GoldTradeDto buyGoldDto, Long userId) {
        Members member = membersRepository.findById(userId)
            .orElseThrow(MemberNotFoundException::new);

        int tradePrice = buyGoldDto.getTradePrice();
        LocalTime now = LocalTime.now();

        //장시간 외이면
        if (now.isAfter(GOLD_END_TIME) || now.isBefore(GOLD_START_TIME)) {
            if (buyGoldDto.getMethod().equals("SELL")) {
                goldWaitingQueueRepository.save(GoldWaitingQueue
                    .builder()
                    .member(member)
                    .tradePrice(tradePrice)
                    .method(TradeMethod.SELL)
                    .build());
                return;
            } else {
                goldWaitingQueueRepository.save(GoldWaitingQueue
                    .builder()
                    .member(member)
                    .tradePrice(tradePrice)
                    .method(TradeMethod.BUY)
                    .build());
                return;
            }
        }

        tradeGold(buyGoldDto, member);
    }

    @Override
    public List<GoldYearDto> goldYearList() {

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(),
            new HttpHeaders());

        ResponseEntity<List<GoldYearDto>> response = restTemplate.exchange(
            MY_SECURITES_BASE_URL + "/api/gold/years",
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<GoldYearDto>>() {
            }
        );

        return response.getBody();

    }

    @Override
    public List<GoldYearDto> goldDayList() {
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(),
            new HttpHeaders());

        ResponseEntity<List<GoldYearDto>> response = restTemplate.exchange(
            MY_SECURITES_BASE_URL + "/api/gold/weeks",
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<GoldYearDto>>() {
            }
        );

        return response.getBody();
    }

    private void tradeGold(GoldTradeDto goldTradeDto, Members member) {
        int goldPrice = getGoldPrice();
        int tradePrice = goldTradeDto.getTradePrice();
        double count = getGoldCount(goldTradeDto.getTradePrice(), goldPrice);
        TradeMethod tradeMethod = null;
        if (goldTradeDto.getMethod().equals("SELL")) {
            //Todo : 거래 가능 검증

            //Todo : 통장에 돈 넣어주기

            tradeMethod = TradeMethod.SELL;

            goldTradeRepository.save(GoldTrade
                .builder()
                .member(member)
                .method(tradeMethod)
                .goldPrice(goldPrice)
                .count(count)
                .tradePrice(tradePrice)
                .build());
        } else {
            //Todo : 통장 돈 검증

            //Todo : 돈 빼기

            tradeMethod = TradeMethod.BUY;

            goldTradeRepository.save(GoldTrade
                .builder()
                .member(member)
                .method(tradeMethod)
                .goldPrice(goldPrice)
                .count(count)
                .tradePrice(tradePrice)
                .build());
        }
    }

    private int getGoldPrice() {
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(),
            new HttpHeaders());

        ResponseEntity<Integer> response = restTemplate.exchange(
            MY_SECURITES_BASE_URL + "/api/gold/get-today-price",
            HttpMethod.GET,
            entity,
            Integer.class
        );

        return response.getBody();
    }

    private double getGoldCount(int tradePrice, int goldPrice) {
        return (double) goldPrice / tradePrice;
    }

    //사용자 잔고 확인
    private boolean checkAccount(Members member) {
        return true;
    }

    //보유 개수 비교
    private boolean compareGold(Members member) {
        return true;
    }
}
