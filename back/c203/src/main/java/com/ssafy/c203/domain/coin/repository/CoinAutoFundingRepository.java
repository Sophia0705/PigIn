package com.ssafy.c203.domain.coin.repository;

import com.ssafy.c203.domain.coin.entity.CoinAutoFunding;
import com.ssafy.c203.domain.stock.entity.StockAutoFunding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoinAutoFundingRepository extends JpaRepository<CoinAutoFunding, Long> {
    Optional<CoinAutoFunding> findByCoinItem_IdAndMember_Id(String coinCode, Long userId);
}
