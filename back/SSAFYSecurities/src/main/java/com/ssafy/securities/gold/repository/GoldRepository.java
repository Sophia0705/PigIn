package com.ssafy.securities.gold.repository;

import com.ssafy.securities.gold.entity.Gold;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GoldRepository extends MongoRepository<Gold, Long> {
    Gold findByDate(String date);
}
