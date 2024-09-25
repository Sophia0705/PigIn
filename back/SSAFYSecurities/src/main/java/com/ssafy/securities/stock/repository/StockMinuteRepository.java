package com.ssafy.securities.stock.repository;

import com.ssafy.securities.stock.entity.StockMinute;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StockMinuteRepository extends MongoRepository<StockMinute, String> {
}
