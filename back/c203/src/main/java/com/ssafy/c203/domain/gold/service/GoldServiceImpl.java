package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.gold.dto.request.BuyGoldDto;
import com.ssafy.c203.domain.gold.entity.GoldTrade;
import com.ssafy.c203.domain.gold.entity.GoldWaitingQueue;
import com.ssafy.c203.domain.gold.repository.GoldTradeRepository;
import com.ssafy.c203.domain.gold.repository.GoldWaitingQueueRepository;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoldServiceImpl implements GoldService {

    private final GoldTradeRepository goldTradeRepository;
    private final GoldWaitingQueueRepository goldWaitingQueueRepository;
    private final MembersRepository membersRepository;
    private final RestTemplate restTemplate;

    private final LocalTime GOLD_END_TIME = LocalTime.of(15, 30);
    private final LocalTime GOLD_START_TIME = LocalTime.of(9, 30);

    @Value("${ssafy.securities.url}")
    private String MY_SECURITES_BASE_URL;


    //Todo : 내 통장에서 돈빼기 해야함
    @Override
    public void buyGoldRequest(BuyGoldDto buyGoldDto, Long userId) {
        Members member = membersRepository.findById(userId)
            .orElseThrow(MemberNotFoundException::new);

        //잔액 확인

        //돈빼기

        int tradePrice = buyGoldDto.getTradePrice();
        LocalTime now = LocalTime.now();

        // 장 시간이 아니면 대기큐에 넣기
        if (now.isAfter(GOLD_END_TIME) || now.isBefore(GOLD_START_TIME)) {
            goldWaitingQueueRepository.save(GoldWaitingQueue
                .builder()
                .member(member)
                .tradePrice(tradePrice)
                .build());
            return;
        }

        //금 구매
        buyGold(buyGoldDto, member);
    }

    private void buyGold(BuyGoldDto buyGoldDto, Members member) {
        //현재 금가격 가져오기 => 함수로 뺄것
        int goldPrice = getGoldPrice();

        int tradePrice = buyGoldDto.getTradePrice();

        //count 수 구하기 => 함수화
        double count = getGoldCount(tradePrice, goldPrice);

        //장시간이면
        goldTradeRepository.save(GoldTrade
            .builder()
            .method(TradeMethod.BUY)
            .count(count)
            .tradePrice(tradePrice)
            .goldPrice(goldPrice)
            .member(member)
            .build());
    }

    @Override
    public void sellGoldInTime(BuyGoldDto buyGoldDto, Long userId) {
        Members member = membersRepository.findById(userId)
            .orElseThrow(MemberNotFoundException::new);

        // 금 현재가격 가져오기
        int goldPrice = getGoldPrice();
        int tradePrice = buyGoldDto.getTradePrice();

        //count 수 세기
        double count = getGoldCount(tradePrice, goldPrice);

        //Todo : 현재갖은 금보다 거래금액이 더 많으면 안됨
        //Todo : 통장에서 돈빼기

        LocalTime now = LocalTime.now();

        if (now.isAfter(GOLD_END_TIME) || now.isBefore(GOLD_START_TIME)) {

        }
        goldTradeRepository.save(GoldTrade
            .builder()
            .member(member)
            .method(TradeMethod.SELL)
            .goldPrice(goldPrice)
            .count(count)
            .tradePrice(tradePrice)
            .build());

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
    private boolean checkAccoung(Members member) {
        return true;
    }

    //보유 개수 비교
    private boolean compareGold(Members member) {
        return true;
    }
}
