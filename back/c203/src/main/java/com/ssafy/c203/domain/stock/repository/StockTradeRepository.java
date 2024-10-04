package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.stock.entity.StockTrade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockTradeRepository extends JpaRepository<StockTrade, Long> {
}
