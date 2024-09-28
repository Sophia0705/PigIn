package com.ssafy.c203.domain.coin.repository.mongo;

import com.ssafy.c203.domain.coin.entity.mongo.MongoCoinHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoCoinHistoryRepository extends MongoRepository<MongoCoinHistory, String> {

}
