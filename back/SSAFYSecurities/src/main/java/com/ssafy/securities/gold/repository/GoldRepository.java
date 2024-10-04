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
        "{ $match: { date: { $gte: ?0, $lte: ?1 } } }",
        "{ $sort: { date: -1 } }", // 날짜를 내림차순으로 정렬 (최신 순)
        "{ $group: { " +
            "    _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, " +
            "    lastData: { $first: '$$ROOT' }" + // $first를 사용하여 각 그룹의 최신 데이터를 선택
            "  }}",
        "{ $replaceRoot: { newRoot: '$lastData' } }",
        "{ $sort: { date: -1 } }" // 최종 결과를 날짜 내림차순으로 정렬
    })
    List<Gold> findMonthlyLastDataLastYear(LocalDate startDate, LocalDate endDate);
}
