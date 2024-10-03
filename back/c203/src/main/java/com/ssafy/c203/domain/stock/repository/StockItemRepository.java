package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.stock.entity.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockItemRepository extends JpaRepository<StockItem, Long> {
}
