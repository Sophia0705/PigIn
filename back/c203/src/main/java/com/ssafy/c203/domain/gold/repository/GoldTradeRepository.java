package com.ssafy.c203.domain.gold.repository;

import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.gold.entity.GoldTrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GoldTradeRepository extends JpaRepository<GoldTrade, Long> {

    @Query("SELECT SUM(g.count) FROM GoldTrade g WHERE g.member.id = :memberId AND g.method = :method")
    Double sumCountByMemberIdAndMethod(@Param("memberId") Long memberId, @Param("method") TradeMethod method);
}
