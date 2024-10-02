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

    @Aggregation(pipeline = {
        "{ $match: { date: { $gte: { $dateSubtract: { startDate: '$$NOW', unit: 'year', amount: 1 } } } } }",
        "{ $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, avgClose: { $avg: { $toDouble: '$close' } } } }",
        "{ $project: { _id: 0, month: '$_id', avgClose: 1 } }",
        "{ $sort: { month: 1 } }"
    })
    List<GoldYearDto> getMonthlyAverageCloseLastYear();
}
