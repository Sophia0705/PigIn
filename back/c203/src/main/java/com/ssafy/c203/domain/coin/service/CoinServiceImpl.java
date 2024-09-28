package com.ssafy.c203.domain.coin.service;

import com.ssafy.c203.domain.coin.dto.FindCoinAllResponse;
import com.ssafy.c203.domain.coin.entity.CoinItem;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import com.ssafy.c203.domain.coin.repository.CoinItemRepository;
import com.ssafy.c203.domain.coin.repository.mongo.MongoCoinHistoryRepository;
import com.ssafy.c203.domain.coin.repository.mongo.MongoCoinMinuteRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CoinServiceImpl implements CoinService {

    private static final Logger log = LoggerFactory.getLogger(CoinServiceImpl.class);
    private final MongoCoinHistoryRepository mongoCoinHistoryRepository;
    private final MongoCoinMinuteRepository mongoCoinMinuteRepository;
    private final CoinItemRepository coinItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FindCoinAllResponse> findAllCoins() {
        List<CoinItem> coinItems = coinItemRepository.findAll();
        HashMap<String, String> coinItemMap = new HashMap<>();
        for (CoinItem coinItem : coinItems) {
            coinItemMap.put(coinItem.getId(), coinItem.getName());
        }

        List<FindCoinAllResponse> responses = mongoCoinMinuteRepository.findLatestDataForEachCoin().stream()
                .map(mongoCoin -> new FindCoinAllResponse(mongoCoin, coinItemMap))
                .toList();
        log.info(responses.toString());
        return responses;
    }

    @Override
    public List<MongoCoinHistory> searchCoins(String keyword) {
        return List.of();
    }

    @Override
    public List<MongoCoinHistory> searchCoins(String keyword, int page) {
        return List.of();
    }

    @Override
    public List<MongoCoinHistory> findCoinChart(String stockCode, String interval, Integer count) {
        return List.of();
    }


//    //쿼리문으로 넣기 귀찮아서 그냥 여기 작정했어요..ㅋ
//    @PostConstruct
//    private void init() {
//        initializeCoinItems();
//    }
//
//
//    public void initializeCoinItems() {
//        List<CoinItem> coinItems = Arrays.asList(
//                new CoinItem("KRW-BTC", "비트코인"),
//                new CoinItem("KRW-ETH", "이더리움"),
//                new CoinItem("KRW-USDT", "테더"),
//                new CoinItem("KRW-XLM", "스텔라루멘"),
//                new CoinItem("KRW-XRP", "리플"),
//                new CoinItem("BTC-ETC", "이더리움클래식"),
//                new CoinItem("BTC-BCH", "비트코인캐시"),
//                new CoinItem("KRW-LINK", "체인링크"),
//                new CoinItem("KRW-ADA", "에이다"),
//                new CoinItem("KRW-DOGE", "도지코인")
//        );
//        coinItemRepository.saveAll(coinItems);
//    }
}
