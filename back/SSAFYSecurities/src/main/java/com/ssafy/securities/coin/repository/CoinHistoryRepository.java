package com.ssafy.securities.coin.repository;

import com.ssafy.securities.coin.entity.CoinHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CoinHistoryRepository extends MongoRepository<CoinHistory, String> {
}
