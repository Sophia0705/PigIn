package com.ssafy.c203.domain.stock.repository.mongo;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MongoStockHistoryRepository extends MongoRepository<MongoStockHistory, String> {
    List<MongoStockHistory> findByStockCodeAndIntervalOrderByDateDesc(String stockCode, String interval, Pageable pageable);
//    List<MongoStockHistory> findByStockCodeAndIntervalOrderByDateDesc(String stockCode, String interval);
}
