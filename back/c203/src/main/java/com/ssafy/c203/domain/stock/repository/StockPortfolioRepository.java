package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.stock.entity.StockItem;
import com.ssafy.c203.domain.stock.entity.StockPortfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockPortfolioRepository extends JpaRepository<StockPortfolio, Long> {
    Optional<StockPortfolio> findByStockItem_IdAndMember_Id(String stockCode, Long memberId);
    Optional<StockPortfolio> findByStockItemAndMember(StockItem stockItem, Members member);
    List<StockPortfolio> findByMember_Id(Long memberId);
}
