package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.stock.entity.StockFavorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockFavoriteRepository extends JpaRepository<StockFavorite, Long> {
    Optional<StockFavorite> findByStockItem_IdAndMember_Id(String stockId, Long userId);
}
