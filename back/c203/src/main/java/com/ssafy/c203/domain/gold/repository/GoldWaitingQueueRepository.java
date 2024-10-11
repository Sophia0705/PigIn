package com.ssafy.c203.domain.gold.repository;

import com.ssafy.c203.domain.gold.entity.GoldWaitingQueue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoldWaitingQueueRepository extends JpaRepository<GoldWaitingQueue, Long> {

}
