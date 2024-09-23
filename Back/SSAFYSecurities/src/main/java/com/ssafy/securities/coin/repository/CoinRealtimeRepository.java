package com.ssafy.securities.coin.repository;

import com.ssafy.securities.coin.entity.CoinRealtime;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CoinRealtimeRepository extends MongoRepository<CoinRealtime, String> {
}
