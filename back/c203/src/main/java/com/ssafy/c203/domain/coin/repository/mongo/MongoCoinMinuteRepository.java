package com.ssafy.c203.domain.coin.repository.mongo;

import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinMinute;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MongoCoinMinuteRepository extends MongoRepository<MongoCoinMinute, String> {
    @Aggregation(pipeline = {
            "{ $sort: { coin: 1, date: -1, time: -1 } }",
            "{ $group: { _id: '$coin', latestData: { $first: '$$ROOT' } } }",
            "{ $replaceRoot: { newRoot: '$latestData' } }"
    })
    List<MongoCoinMinute> findLatestDataForEachCoin();

    Optional<MongoCoinMinute> findTopByCoinOrderByDateDescTimeDesc(String coin);
}
