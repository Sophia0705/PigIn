package com.ssafy.c203.domain.gold.repository;

import com.ssafy.c203.domain.gold.entity.GoldAutoFunding;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoldAutoFundingRepository extends JpaRepository<GoldAutoFunding, Long> {
    Optional<GoldAutoFunding> findByMemberId(Long memberId);
}
