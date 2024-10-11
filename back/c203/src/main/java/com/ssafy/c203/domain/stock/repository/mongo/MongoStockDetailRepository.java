package com.ssafy.c203.domain.stock.repository.mongo;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MongoStockDetailRepository extends MongoRepository<MongoStockDetail, String> {
    @Aggregation(pipeline = {
            "{ $match: { htsKorIsnm: { $regex: ?0, $options: 'i' } } }",
            "{ $sort: { stckBsopDate: -1 } }",
            "{ $group: { _id: '$stckShrnIscd', latestDocument: { $first: '$$ROOT' } } }",
            "{ $replaceRoot: { newRoot: '$latestDocument' } }"
    })
    List<MongoStockDetail> findLatestByHtsKorIsnmContainingIgnoreCase(String keyword);

    @Aggregation(pipeline = {
            "{ $sort: { stckBsopDate: -1 } }",
            "{ $group: { _id: '$stckShrnIscd', latestDocument: { $first: '$$ROOT' } } }",
            "{ $replaceRoot: { newRoot: '$latestDocument' } }"
    })
    List<MongoStockDetail> findLatestForAllStocks();

    Optional<MongoStockDetail> findTopByStckShrnIscdOrderByStckBsopDateDesc(String stockCode);
}
