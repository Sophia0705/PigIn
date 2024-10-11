package com.ssafy.c203.domain.coin.repository.mongo;

import com.ssafy.c203.domain.coin.entity.mongo.CoinMinute;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CoinMinuteRepository extends MongoRepository<CoinMinute, String> {

}
