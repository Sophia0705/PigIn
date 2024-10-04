package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.stock.entity.StockWaitingQueue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockWaitingQueueRepository extends JpaRepository<StockWaitingQueue, Long> {
}
