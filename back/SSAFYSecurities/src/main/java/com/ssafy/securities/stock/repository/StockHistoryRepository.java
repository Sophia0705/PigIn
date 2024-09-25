package com.ssafy.securities.stock.repository;

import com.ssafy.securities.stock.entity.StockHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StockHistoryRepository extends MongoRepository<StockHistory, String> {
}
