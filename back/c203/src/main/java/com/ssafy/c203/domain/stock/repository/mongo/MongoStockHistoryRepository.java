package com.ssafy.c203.domain.stock.repository.mongo;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoStockHistoryRepository extends MongoRepository<MongoStockHistory, String> {
}
