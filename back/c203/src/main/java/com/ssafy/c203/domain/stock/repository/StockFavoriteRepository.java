package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.stock.entity.StockFavorite;
import com.ssafy.c203.domain.stock.entity.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StockFavoriteRepository extends JpaRepository<StockFavorite, Long> {
    Optional<StockFavorite> findByStockItem_IdAndMember_Id(String stockId, Long userId);

    @Query("SELECT sf.stockItem " +
            "FROM StockFavorite sf " +
            "GROUP BY sf.stockItem " +
            "ORDER BY COUNT(sf) DESC " +
            "LIMIT :limit")
    List<StockItem> findTopNMostFavoriteStocks(@Param("limit") int limit);

    @Query("SELECT sf.stockItem FROM StockFavorite sf WHERE sf.member.id = :memberId")
    List<StockItem> findStockItemsByMemberId(@Param("memberId") Long memberId);
}
