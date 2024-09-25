package com.ssafy.c203.domain.stock.service;

import com.ssafy.c203.domain.stock.repository.mongo.MongoStockDetailRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockHistoryRepository;
import com.ssafy.c203.domain.stock.repository.mongo.MongoStockMinuteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public List<?> findAllStock() {
        return List.of();
    }

    @Override
    public List<?> searchStock(String keyword) {
        return List.of();
    }

    @Override
    public void findStock(String stockCode) {

    }

    @Override
    public List<?> findStockChart() {
        return List.of();
    }
}
