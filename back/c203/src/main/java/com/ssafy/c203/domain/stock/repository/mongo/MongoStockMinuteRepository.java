package com.ssafy.c203.domain.stock.repository.mongo;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockMinute;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MongoStockMinuteRepository extends MongoRepository<MongoStockMinute, String> {
    @Aggregation(pipeline = {
            "{ $sort: { stockCode: 1, date: -1, time: -1 } }",
            "{ $group: { _id: '$stockCode', latestDocument: { $first: '$$ROOT' } } }",
            "{ $replaceRoot: { newRoot: '$latestDocument' } }"
    })
    List<MongoStockMinute> findLatestStockMinuteForEachStock();

    List<MongoStockMinute> findByStockCodeOrderByDateDescTimeDesc(String stockCode, Pageable pageable);

    Optional<MongoStockMinute> findTopByStockCodeOrderByDateDescTimeDesc(String stockCode);
}
