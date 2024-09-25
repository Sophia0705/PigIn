package com.ssafy.securities.coin.repository;

import com.ssafy.securities.coin.entity.CoinMinute;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CoinMinuteRepository extends MongoRepository<CoinMinute, String> {
}
