package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.stock.entity.StockAutoFunding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface StockAutoFundingRepository extends JpaRepository<StockAutoFunding, Long> {
    Optional<StockAutoFunding> findByStockItem_IdAndMember_Id(String stockCode, Long userId);
    List<StockAutoFunding> findAllByMember_Id(Long memberId);
}
