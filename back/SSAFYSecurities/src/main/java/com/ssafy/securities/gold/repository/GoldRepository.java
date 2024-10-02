package com.ssafy.securities.gold.repository;

import com.ssafy.securities.gold.dto.response.GoldYearDto;
import com.ssafy.securities.gold.entity.Gold;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface GoldRepository extends MongoRepository<Gold, Long> {
    Gold findByDate(String date);

    List<Gold> findAllByOrderByDateDesc(Pageable pageable);

    @Query(value = "{ 'date': { $gte: ?0, $lte: ?1 } }",
        sort = "{ 'date': 1 }")
    List<Gold> findAllByDateBetweenOrderByDateAsc(LocalDate startDate, LocalDate endDate);
}
