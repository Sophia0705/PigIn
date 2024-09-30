package com.ssafy.c203.domain.coin.repository.mongo;

import com.ssafy.c203.domain.coin.entity.mongo.CoinHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CoinHistoryRepository extends MongoRepository<CoinHistory, String> {
}
