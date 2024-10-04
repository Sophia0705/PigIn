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
import com.ssafy.c203.domain.gold.exception.GoldFavoriteNotFoundException;
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
        log.info("{} 거래 들어옴", buyGoldDto.getMethod());
        Members member = membersRepository.findById(userId)
            .orElseThrow(MemberNotFoundException::new);

        int tradePrice = buyGoldDto.getTradePrice();
        LocalTime now = LocalTime.now();

        //장시간 외이면
        if (now.isAfter(GOLD_END_TIME) || now.isBefore(GOLD_START_TIME)) {
            log.info("장 외 시간 거래 들어옴");
            if (buyGoldDto.getMethod().equals("SELL")) {
                try {
                    //거래 가능 검증
                    boolean canSell = compareGold(member, getGoldCount(tradePrice, getGoldPrice()));
                    log.info("장 외 SELL일때 팔 수 있냐? : {}", canSell);
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
                    log.info("초 비상 거래 안됨");
                    throw new TradeErrorExeption();
                }
                //통장에 돈 넣어주기
                accountService.depositAccount(member.getId(), (long) tradePrice);
                log.info("거래완료");
                return;
            } else {
                try {
                    //통장 돈 검증
                    log.info("장외 BUY 요청 들어옴");
                    boolean canBuy = checkAccount(member, tradePrice);
                    if (!canBuy) {
                        log.info("돈도 없냐 그지새끼야");
                        throw new NoMoneyException();
                    }

                    //돈 빼기
                    accountService.withdrawAccount(member.getId(), (long) tradePrice);
                    log.info("돈빼기 완료 ~");
                } catch (Exception e) {
                    log.info("돈빼다 오류 발생 삐용삐용");
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
        GoldAutoFunding goldAutoFunding = autoFundingRepository.findByMember_Id(userId)
            .orElseThrow(AutoFundingNotFoundException::new);

        autoFundingRepository.delete(goldAutoFunding);
    }

    @Override
    @Transactional
    public void setAutoFundingRate(Long userId, int rate) {
        GoldAutoFunding goldAutoFunding = autoFundingRepository.findByMember_Id(userId)
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

    @Override
    public void cancelFavoriteGold(Long userId) {
        GoldFavorite goldFavorite = goldFavoriteRepository.findByMember_Id(userId)
            .orElseThrow(GoldFavoriteNotFoundException::new);

        goldFavoriteRepository.delete(goldFavorite);
    }

    @Override
    public boolean isFavoriteGold(Long userId) {
        return goldFavoriteRepository.existsByMember_Id(userId);
    }

    @Override
    public boolean isAutoFundingGold(Long userId) {
        return autoFundingRepository.existsByMember_Id(userId);
    }

    @Override
    public double getMine(Long userId) {
        Members member = membersRepository.findById(userId)
            .orElseThrow(MemberNotFoundException::new);

        Double buyCnt = goldTradeRepository.sumCountByMemberIdAndMethod(member.getId(),
            TradeMethod.BUY);
        Double sellCnt = goldTradeRepository.sumCountByMemberIdAndMethod(member.getId(),
            TradeMethod.SELL);

        Double mineCnt = buyCnt;
        if (sellCnt != null) {
            mineCnt = buyCnt - sellCnt;
        }

        int goldPrice = getGoldPrice();

        return mineCnt * goldPrice;
    }

    private void tradeGold(GoldTradeDto goldTradeDto, Members member) {
        log.info("장내 {} 거래 들어옴", goldTradeDto.getMethod());
        int goldPrice = getGoldPrice();
        log.info("금 가격 : {}", goldPrice);
        int tradePrice = goldTradeDto.getTradePrice();
        log.info("거래 가격 : {}", tradePrice);
        double count = getGoldCount(goldTradeDto.getTradePrice(), goldPrice);
        log.info("거래 개수 : {}", count);
        TradeMethod tradeMethod = null;
        if (goldTradeDto.getMethod().equals("SELL")) {
            try {
                //거래 가능 검증
                log.info("SELL 요청 들어옴");
                boolean canSell = compareGold(member, count);
                if (!canSell) {
                    log.info("장 내 팔수 없다 마 걔쉐이야!");
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
                log.info("장 내 BUY 들어옴");
                //통장 돈 검증
                boolean canBuy = checkAccount(member, tradePrice);
                if (!canBuy) {
                    log.info("장 내 돈도 없냐 걔쒜이야");
                    throw new NoMoneyException();
                }

                //돈 빼기
                accountService.withdrawAccount(member.getId(), (long) tradePrice);
                log.info("돈 뺐다 마 걔쒜이야");
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
        log.info("나의 구매 개수 : {}", buyCnt);
        Double sellCnt = goldTradeRepository.sumCountByMemberIdAndMethod(member.getId(),
            TradeMethod.SELL);
        log.info("나의 판매 개수 : {}", sellCnt);
        Double mineCnt = buyCnt;

        if (sellCnt != null) {
            mineCnt = buyCnt - sellCnt;
        }
        log.info("내 개수 : {}", mineCnt);
        //판매 개수가 내 개수보다 많으면
        if (cnt > mineCnt) {
            return false;
        }
        return true;
    }
}
