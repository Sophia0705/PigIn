package com.ssafy.c203.domain.gold.repository;

import com.ssafy.c203.domain.gold.entity.GoldPortfolio;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoldPortfolioRepository extends JpaRepository<GoldPortfolio, Long> {
    Optional<GoldPortfolio> findByMember_Id(Long memberId);
}
