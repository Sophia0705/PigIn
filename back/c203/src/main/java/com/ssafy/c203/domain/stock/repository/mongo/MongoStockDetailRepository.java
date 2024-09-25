package com.ssafy.c203.domain.stock.repository.mongo;

import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoStockDetailRepository extends MongoRepository<MongoStockDetail, String> {

}
