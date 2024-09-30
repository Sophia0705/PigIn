package com.ssafy.c203.domain.coin.repository.mongo;

import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MongoCoinHistoryRepository extends MongoRepository<MongoCoinHistory, String> {
    List<MongoCoinHistory> findByCoinAndIntervalOrderByDateDesc(String coin, String interval, Pageable pageable);
}
