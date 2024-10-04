package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;
import com.ssafy.c203.domain.gold.dto.response.GoldDetailDto;
import com.ssafy.c203.domain.gold.dto.response.GoldDto;
import com.ssafy.c203.domain.gold.dto.response.GoldYearDto;
import com.ssafy.c203.domain.gold.entity.GoldAutoFunding;
import com.ssafy.c203.domain.gold.entity.GoldFavorite;
import com.ssafy.c203.domain.gold.entity.GoldTrade;
import com.ssafy.c203.domain.gold.entity.GoldWaitingQueue;
import com.ssafy.c203.domain.gold.exception.AutoFundingNotFoundException;
import com.ssafy.c203.domain.gold.exception.MoreSellException;
import com.ssafy.c203.domain.gold.exception.NoMoneyException;
import com.ssafy.c203.domain.gold.exception.TradeErrorExeption;
import com.ssafy.c203.domain.gold.repository.GoldAutoFundingRepository;
import com.ssafy.c203.domain.gold.repository.GoldFavoriteRepository;
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
    private final AccountService accountService;
    private final GoldAutoFundingRepository autoFundingRepository;
    private final GoldFavoriteRepository goldFavoriteRepository;

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

                try {
                    //거래 가능 검증
                    boolean canSell = compareGold(member, getGoldCount(tradePrice, getGoldPrice()));
                    if (!canSell) {
                        throw new MoreSellException();
                    }

                    goldWaitingQueueRepository.save(GoldWaitingQueue
                        .builder()
                        .member(member)
                        .tradePrice(tradePrice)
                        .method(TradeMethod.SELL)
                        .build());
                } catch (Exception e) {
                    throw new TradeErrorExeption();
                }
                //통장에 돈 넣어주기
                accountService.depositAccount(member.getId(), (long) tradePrice);
                return;
            } else {
                try {
                    //통장 돈 검증
                    boolean canBuy = checkAccount(member, tradePrice);
                    if (!canBuy) {
                        throw new NoMoneyException();
                    }

                    //돈 빼기
                    accountService.withdrawAccount(member.getId(), (long) tradePrice);
                } catch (Exception e) {
                    throw new TradeErrorExeption();
                }
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
    public List<GoldDto> goldDayList() {
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(),
            new HttpHeaders());

        ResponseEntity<List<GoldDto>> response = restTemplate.exchange(
            MY_SECURITES_BASE_URL + "/api/gold/weeks",
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<GoldDto>>() {
            }
        );

        return response.getBody();
    }

    @Override
    public List<GoldDto> goldMonthList() {
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(),
            new HttpHeaders());

        ResponseEntity<List<GoldDto>> response = restTemplate.exchange(
            MY_SECURITES_BASE_URL + "/api/gold/months",
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<GoldDto>>() {
            }
        );

        return response.getBody();
    }

    @Override
    public GoldDetailDto goldDetail() {
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(),
            new HttpHeaders());

        ResponseEntity<GoldDetailDto> response = restTemplate.exchange(
            MY_SECURITES_BASE_URL + "/api/gold/detail",
            HttpMethod.GET,
            entity,
            GoldDetailDto.class
        );
        return response.getBody();
    }

    @Override
    public List<GoldDto> goldThreeMonthList() {
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(new HashMap<>(),
            new HttpHeaders());

        ResponseEntity<List<GoldDto>> response = restTemplate.exchange(
            MY_SECURITES_BASE_URL + "/api/gold/three-months",
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<GoldDto>>() {
            }
        );

        return response.getBody();
    }

    @Override
    public void addAutoFunding(Long userId) {
        Members member = membersRepository.findById(userId)
            .orElseThrow(MemberNotFoundException::new);

        autoFundingRepository.save(GoldAutoFunding
            .builder()
            .member(member)
            .build());
    }

    @Override
    public void cancelAutoFunding(Long userId) {
        GoldAutoFunding goldAutoFunding = autoFundingRepository.findByMemberId(userId)
            .orElseThrow(AutoFundingNotFoundException::new);

        autoFundingRepository.delete(goldAutoFunding);
    }

    @Override
    @Transactional
    public void setAutoFundingRate(Long userId, int rate) {
        GoldAutoFunding goldAutoFunding = autoFundingRepository.findByMemberId(userId)
            .orElseThrow(AutoFundingNotFoundException::new);
        goldAutoFunding.updateRate(rate);
    }

    @Override
    public void favoriteGold(Long userId) {
        Members member = membersRepository.findById(userId)
            .orElseThrow(MemberNotFoundException::new);

        goldFavoriteRepository.save(GoldFavorite
            .builder()
            .member(member)
            .build());
    }

    private void tradeGold(GoldTradeDto goldTradeDto, Members member) {
        int goldPrice = getGoldPrice();
        int tradePrice = goldTradeDto.getTradePrice();
        double count = getGoldCount(goldTradeDto.getTradePrice(), goldPrice);
        TradeMethod tradeMethod = null;
        if (goldTradeDto.getMethod().equals("SELL")) {
            try {
                //거래 가능 검증
                boolean canSell = compareGold(member, count);
                if (!canSell) {
                    throw new MoreSellException();
                }

                tradeMethod = TradeMethod.SELL;

                goldTradeRepository.save(GoldTrade
                    .builder()
                    .member(member)
                    .method(tradeMethod)
                    .goldPrice(goldPrice)
                    .count(count)
                    .tradePrice(tradePrice)
                    .build());
            } catch (Exception e) {
                throw new TradeErrorExeption();
            }
            //통장에 돈 넣어주기
            accountService.depositAccount(member.getId(), (long) tradePrice);
        } else {
            try {
                //통장 돈 검증
                boolean canBuy = checkAccount(member, tradePrice);
                if (!canBuy) {
                    throw new NoMoneyException();
                }

                //돈 빼기
                accountService.withdrawAccount(member.getId(), (long) tradePrice);
            } catch (Exception e) {
                throw new TradeErrorExeption();
            }
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
        return (double) tradePrice / goldPrice;
    }

    //사용자 잔고 확인
    private boolean checkAccount(Members member, int price) {
        Long remind = accountService.findDAccountBalanceByMemberId(
            member.getId());
        //잔액이 거래금액보다 많으면
        if (remind >= price) {
            return true;
        }
        return false;
    }

    //보유 개수 비교
    private boolean compareGold(Members member, double cnt) {
        Double buyCnt = goldTradeRepository.sumCountByMemberIdAndMethod(member.getId(),
            TradeMethod.BUY);
        Double sellCnt = goldTradeRepository.sumCountByMemberIdAndMethod(member.getId(),
            TradeMethod.SELL);

        Double mineCnt = buyCnt - sellCnt;
        //판매 개수가 내 개수보다 많으면
        if (cnt > mineCnt) {
            return false;
        }
        return true;
    }
}
