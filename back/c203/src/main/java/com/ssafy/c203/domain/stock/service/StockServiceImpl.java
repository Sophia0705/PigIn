package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockDetailRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockHistoryRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockMinuteRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StockServiceImpl implements StockService {

    private final MongoStockDetailRepository mongoStockDetailRepository;
    private final MongoStockHistoryRepository mongoStockHistoryRepository;
    private final MongoStockMinuteRepository mongoStockMinuteRepository;
    private Map<String, String> intervals;

    @PostConstruct
    public void init() {
        intervals = new HashMap<>();
        intervals.put("day", "D");
        intervals.put("week", "W");
        intervals.put("month", "M");
    }

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
        try {
            List<MongoStockHistory> tmp = mongoStockHistoryRepository.findByStockCodeAndIntervalOrderByDateDesc(stockCode, intervals.get(interval), pageable);
            return tmp;
        } catch (Exception e) {
            log.error("Error fetching stock chart: ", e);
            throw new RuntimeException("Failed to fetch stock chart", e);
        }
//        log.info("tmp = {}", tmp);
    }

    @Override
    public List<MongoStockMinute> findStockMinuteChart(String stockCode, Integer count) {
        Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "date"));
        List<MongoStockMinute> tmp = mongoStockMinuteRepository.findByStockCodeOrderByDateDescTimeDesc(stockCode, pageable);
        return tmp;
    }

    @Override
    public List<MongoStockMinute> findStockMinute() {
        return mongoStockMinuteRepository.findLatestStockMinuteForEachStock();
    }


}
