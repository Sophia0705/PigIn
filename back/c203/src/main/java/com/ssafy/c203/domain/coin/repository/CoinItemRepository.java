package com.ssafy.c203.domain.coin.repository;

import com.ssafy.c203.domain.coin.entity.CoinItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinItemRepository extends JpaRepository<CoinItem, String> {
}
