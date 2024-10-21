package com.ssafy.securities.stock.repository;

import com.ssafy.securities.stock.entity.StockDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StockDetailRepository extends MongoRepository<StockDetail, String> {
}
