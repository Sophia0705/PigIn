package com.ssafy.c203.domain.stock.repository.mongo;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MongoStockDetailRepository extends MongoRepository<MongoStockDetail, String> {
    @Query("{ 'htsKorIsnm': { $regex: ?0, $options: 'i' } }")
    List<MongoStockDetail> findByHtsKorIsnmLike(String keyword);
}
