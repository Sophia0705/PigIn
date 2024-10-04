package com.ssafy.securities.stock.repository;

import com.ssafy.securities.stock.entity.StockMinute;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface StockMinuteRepository extends MongoRepository<StockMinute, String> {
    Optional<StockMinute> findFirstByStockCodeOrderByDateDescTimeDesc(String stockCode);
}
