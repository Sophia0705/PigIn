package com.ssafy.securities.stock.repository;

import com.ssafy.securities.stock.entity.StockRealtime;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StockRealtimeRepository extends MongoRepository<StockRealtime, String> {
}
