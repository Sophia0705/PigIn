package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.stock.dto.response.StockRankDto;
import com.ssafy.c203.domain.stock.entity.StockItem;
import com.ssafy.c203.domain.stock.entity.StockPortfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;

public interface StockPortfolioRepository extends JpaRepository<StockPortfolio, Long> {

    Optional<StockPortfolio> findByStockItem_IdAndMember_Id(String stockCode, Long memberId);

    Optional<StockPortfolio> findByStockItemAndMember(StockItem stockItem, Members member);

    List<StockPortfolio> findByMember_Id(Long memberId);

    @Query(
        "SELECT new com.ssafy.c203.domain.stock.dto.response.StockRankDto(sp.stockItem.id, sp.stockItem.name)"
            +
            "FROM StockPortfolio sp " +
            "GROUP BY sp.stockItem.id, sp.stockItem.name " +
            "ORDER BY SUM(sp.amount) DESC " +
            "LIMIT 5")
    List<StockRankDto> findTop5ByStockItemIdGroupByAmount();
}
