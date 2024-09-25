package com.ssafy.c203.domain.stock.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoStockMinuteRepository extends MongoRepository<MongoStockMinuteRepository, Long> {
}
