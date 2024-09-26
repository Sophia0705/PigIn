package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockDetailRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockHistoryRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockMinuteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StockServiceImpl implements StockService {

    private final MongoStockDetailRepository mongoStockDetailRepository;
    private final MongoStockHistoryRepository mongoStockHistoryRepository;
    private final MongoStockMinuteRepository mongoStockMinuteRepository;

    @Override
    public List<MongoStockDetail> findAllStock() {
        try {
            // 연결 테스트
//            mongoStockDetailRepository.count();
            return mongoStockDetailRepository.findAll();
        } catch (Exception e) {
            log.error("Error fetching all stocks: ", e);
            throw new RuntimeException("Failed to fetch stocks from database", e);
        }
    }

    @Override
    public List<MongoStockDetail> searchStock(String keyword) {
        return mongoStockDetailRepository.findByHtsKorIsnmLike(keyword);
    }

    @Override
    public MongoStockDetail findStock(String stockCode) {
        return mongoStockDetailRepository.findByStckShrnIscd(stockCode).orElseThrow();
    }

    @Override
    public List<MongoStockHistory> findStockChart(String stockCode, String interval, Integer count) {
        Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "date"));
        List<MongoStockHistory> tmp = mongoStockHistoryRepository.findByStockCodeAndIntervalOrderByDateDesc(stockCode, interval, pageable);
//        log.info("tmp = {}", tmp);
        return tmp;
    }

    @Override
    public List<MongoStockMinute> findStockMinute() {
        return mongoStockMinuteRepository.findLatestStockMinuteForEachStock();
    }
}
