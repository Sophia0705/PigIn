package com.ssafy.securities.coin.repository;

import com.ssafy.securities.coin.entity.CoinMinute;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CoinMinuteRepository extends MongoRepository<CoinMinute, String> {
    Optional<CoinMinute> findFirstByCoinOrderByDateDescTimeDesc(String coinCode);
}
